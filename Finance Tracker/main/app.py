from flask import Flask, render_template, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Transaction
from forms import RegisterForm, LoginForm, TransactionForm
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'change-this-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tracker.db'

db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_pw = generate_password_hash(form.password.data)
        user = User(email=form.email.data, password=hashed_pw)
        db.session.add(user)
        db.session.commit()
        flash('Account created! Please log in.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid credentials.', 'danger')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/')
@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    form = TransactionForm()
    if form.validate_on_submit():
        t = Transaction(
            description = form.description.data,
            amount = form.amount.data,
            date = form.date.data,
            owner = current_user
        )
        db.session.add(t)
        db.session.commit()
        flash('Transaction added.', 'success')
        return redirect(url_for('dashboard'))

    transactions = Transaction.query.filter_by(user_id=current_user.id)\
        .order_by(Transaction.date.desc()).all()

    balance = sum(t.amount for t in transactions)
    return render_template('dashboard.html', form=form, transactions=transactions, 
                           balance=balance)

if __name__ == '__main__':
    with app.app_context():
        # create tracker.db on first run
        db.create_all()
    app.run(debug=True)
