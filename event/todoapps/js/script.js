document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
  });
});
const todos = [];

const RENDER_EVENT = 'render-todo';

document.addEventListener(RENDER_EVENT, () => {
  const uncompleteList = document.getElementById('uncompleteTodo');
  uncompleteList.innerHTML = '';
  const completeList = document.getElementById('completeTodo');
  completeList.innerHTML = '';
  todos.forEach((element) => {
    const todoMake = makeTodo(element);
    if (!element.isCompleted) {
      uncompleteList.append(todoMake);
    } else {
      completeList.append(todoMake);
    }
  });
});

function addTodo() {
  const todo = document.getElementById('title').value;
  const time = document.getElementById('date').value;

  const id = generateId();

  const todoObject = generateTodoObject(id, todo, time, false);
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateTodoObject(id, todo, time, isCompleted) {
  return {
    id,
    todo,
    time,
    isCompleted,
  };
}

function makeTodo(todo) {
  const title = document.createElement('h2');
  title.innerText = todo.todo;

  const time = document.createElement('p');
  time.innerText = todo.time;

  const text = document.createElement('div');
  text.classList.add('inner');
  text.append(title, time);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(text);
  container.setAttribute('id', `todo-${todo.id}`);

  if (todo.isCompleted) {
    const undoBtn = document.createElement('button');
    undoBtn.classList.add('undo-button');
    undoBtn.addEventListener('click', () => {
      undoTask(todo.id);
    });

    const trashBtn = document.createElement('button');
    trashBtn.classList.add('trash-button');
    trashBtn.addEventListener('click', () => {
      removeTask(todo.id);
    });
    container.append(undoBtn, trashBtn);
  } else {
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('check-button');
    completeBtn.addEventListener('click', () => {
      completeTask(todo.id);
    });

    container.append(completeBtn);
  }

  return container;
}

function completeTask(id) {
  const todoFind = findTodo(id);
  if (todoFind == null) return;

  todoFind.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(id) {
  for (const data of todos) {
    if (data.id === id) {
      return data;
    }
  }
  return null;
}

function undoTask(id) {
  const todoFind = findTodo(id);
  if (todoFind == null) return;

  todoFind.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTask(id) {
  const todoFind = findTodo(id);
  if (todoFind === -1) return;

  todos.splice(todoFind, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}
