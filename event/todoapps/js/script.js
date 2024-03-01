// inisialisasi localstorage jika kosong tidak terjadi error
const todoList = JSON.parse(getStorage()) || [];

const RENDER_EVENT = 'render-todo';

// load konten ketika halaman diload
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
  });
  document.dispatchEvent(new Event(RENDER_EVENT));
});

// event untuk render todolist
document.addEventListener(RENDER_EVENT, () => {
  // setiap event dipanggil kita hapus semua element yg sebelumnya telah dibuat
  const uncompleteList = document.getElementById('uncompleteTodo');
  uncompleteList.innerHTML = '';
  const completeList = document.getElementById('completeTodo');
  completeList.innerHTML = '';

  // setiap event render_event dipanggil akan membuat element pada fungsi makeTodo
  todoList.forEach((element) => {
    const todoMake = makeTodo(element);
    if (!element.isCompleted) {
      // memasukan element yg dibuat kedalam tag dari uncompletedTodo
      uncompleteList.append(todoMake);
    } else {
      completeList.append(todoMake);
    }
  });
});

// menambahkan todo
function addTodo() {
  const todo = document.getElementById('title').value;
  const time = document.getElementById('date').value;

  //membuat generate dari timestamp + disini untuk konversi dari timestamp date ke string
  const id = +new Date();

  // untuk menampung data dalam bentuk json
  const todoObject = {
    id,
    todo,
    time,
    isCompleted: false,
  };

  // melakukan push ke array localstorage yang sudah di inisialisasi sebelumnya
  todoList.push(todoObject);

  // diatas ini kita menambahkan data ke array yg tersimpan sementara lalu kita set ulang keseluruhan datanya ke localstorage seolah2 hanya menambahkan data yg perlu tetap tidak disini datanya di set ulang
  setStorage(JSON.stringify(todoList));

  // setelah menambahkan data ke localstorage panggil lagi render supaya data baru muncul tanpa perlu refresh (karena submit disini pakai preventDefault untuk mencegah refresh)
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// membuat element todolist, setiap element dibuat disini sebelum di render
function makeTodo(todo) {
  // membuat element h2 untuk title
  const title = document.createElement('h2');
  title.innerText = todo.todo;

  // membuat element p untuk tanggal
  const time = document.createElement('p');
  time.innerText = todo.time;

  // membuat element div untuk menampung title dan tanggal akan berada di dalam tag ini
  const text = document.createElement('div');
  text.classList.add('inner');
  text.append(title, time);

  // membuat element div dengan id dari masing2 todo untuk menampung isi dari todo
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(text);
  container.setAttribute('id', todo.id);

  // menampilkan undo & trash btn ketika isComplete true & memanggil function ketika event click terjadi
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
    // memasukan btn ke tag div dengan class  item shadow yang sudah dibuat diatas
    container.append(undoBtn, trashBtn);
  } else {
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('check-button');
    completeBtn.addEventListener('click', () => {
      completeTask(todo.id);
    });

    // memasukan btn ke tag div dengan class  item shadow yang sudah dibuat diatas
    container.append(completeBtn);
  }

  return container;
}

function completeTask(id) {
  // mencari index dari todolist
  // findIndex mencari index dari todolist jika ditemukan maka result nya -1 oleh karena itu disini membuat kondisi findTodo !== -1
  const findTodo = todoList.findIndex((todo) => todo.id === id);
  if (findTodo !== -1) {
    // mengubah todoList dengan index yg sudah didapatkan
    todoList[findTodo].isCompleted = true;

    // set ulang ke localStorage termasuk perubahan yg dilakukan sebelumnya
    setStorage(JSON.stringify(todoList));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function undoTask(id) {
  const findTodo = todoList.findIndex((todo) => todo.id === id);
  if (findTodo !== -1) {
    todoList[findTodo].isCompleted = false;
    setStorage(JSON.stringify(todoList));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function removeTask(id) {
  const findTodo = todoList.findIndex((todo) => todo.id === id);
  if (findTodo !== -1) {
    // menghapus array dengan parameter pertama adalah index yg ingin dihapus, parameter kedua jumlah yg ingin dihapus
    todoList.splice(findTodo, 1);
    setStorage(JSON.stringify(todoList));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// get value dari localstorage nama nya berdasarkan key yg di set di setItem
function getStorage() {
  return localStorage.getItem('todos');
}

function setStorage(val) {
  return localStorage.setItem('todos', val);
}
