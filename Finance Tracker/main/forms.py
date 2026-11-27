from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, FloatField, DateField, SubmitField
from wtforms.validators import DataRequired, Email, Length

class RegisterForm(FlaskForm):
    email    = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    submit   = SubmitField('Register')

class LoginForm(FlaskForm):
    email    = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit   = SubmitField('Login')

class TransactionForm(FlaskForm):
    description = StringField('Description', validators=[DataRequired()])
    amount      = FloatField('Amount (negative for expense)', validators=[DataRequired()])
    date        = DateField('Date', validators=[DataRequired()])
    submit      = SubmitField('Add')