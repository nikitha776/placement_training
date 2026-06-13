// DOM elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage on page load
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Render existing tasks
renderTasks();

// Add task on button click
addBtn.addEventListener('click', addTask);

// Add task on Enter key
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
      <span>${escapeHTML(task.text)}</span>
      <button class="complete-btn" title="Toggle complete">&#10003;</button>
      <button class="delete-btn" title="Delete">&#10005;</button>
    `;

    li.querySelector('.complete-btn').addEventListener('click', () => toggleTask(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}

// Prevent XSS by escaping user input
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
