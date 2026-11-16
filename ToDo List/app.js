// --- State ---
let tasks = [];
let currentFilter = 'all';

// --- Persistance ---
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
}

// --- CRUD ---
function addTask(text) {
    tasks.push({id: Date.now(), text: text.trim(), completed: false})
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id? {
        ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// --- Rendering ---
function renderTasks() {
    const list = document.getElementById('task-list');
    const emptyMsg = document.getElementById('empty-msg')

    const filtered = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    })

    list.innerHTML = '';

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? 'completed' : '')

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));


        const span = document.createElement('span')
        span.className = 'task-text';
        span.textContent = task.text;

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'X';
        delBtn.addEventListener('click', () => deleteTask(task.id))

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    })

    emptyMsg.style.display = filtered.length === 0? 'block' : 'none';
}

// --- Event wiring ---
document.getElementById('add-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    if (input.value.trim()) {
        addTask(input.value);
        input.value = '';
        input.focus();
    }
})

document.getElementById('task-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('add-btn').click();
})

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks();
    })
})

// --- Boot up ---
loadTasks();
renderTasks();
