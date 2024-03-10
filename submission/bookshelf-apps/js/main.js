const bookList = JSON.parse(getStorage()) || [];
const books = [];
const RENDER_BOOKS = 'render-books';
const searchVal = document.getElementById('searchBookTitle');

document.addEventListener('DOMContentLoaded', () => {
  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });
  searchVal.addEventListener('input', searchBook);
  document.dispatchEvent(new Event(RENDER_BOOKS));
});

document.addEventListener(RENDER_BOOKS, () => {
  const modal = document.getElementById('modal');
  modal.innerHTML = '';
  document.getElementById('overlay').style.display = 'none';
  document.querySelector('body').style.overflow = 'auto';

  const incomplete = document.getElementById('incompleteBookshelfList');
  const complete = document.getElementById('completeBookshelfList');

  incomplete.innerHTML = '';
  complete.innerHTML = '';

  if (searchVal.value.length > 0) {
    books.forEach((el) => {
      let createBooks = createBooksList(el);
      if (!el.isComplete) {
        incomplete.append(createBooks);
      } else {
        complete.append(createBooks);
      }
    });
  } else {
    bookList.forEach((el) => {
      let createBooks = createBooksList(el);
      if (!el.isComplete) {
        incomplete.append(createBooks);
      } else {
        complete.append(createBooks);
      }
    });
  }
});

function addBook() {
  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isCompleteInput = document.getElementById(
    'inputBookIsComplete'
  ).checked;

  const bookObject = {
    id: +new Date(),
    title: title,
    author: author,
    year: year,
    isComplete: isCompleteInput
  };
  bookList.push(bookObject);
  setStorage(bookList);
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function searchBook() {
  const resetBtn = document.getElementById('reset');
  if (searchVal.value.length > 2) {
    books.length = 0;
    const filteredBooks = bookList.filter((book) =>
      book.title.toLowerCase().includes(searchVal.value.toLowerCase())
    );
    books.push(...filteredBooks);

    resetBtn.hidden = false;
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      books.length = 0;
      resetBtn.hidden = true;
      resetBtn.value = 0;
      searchVal.value = '';
      document.dispatchEvent(new Event(RENDER_BOOKS));
    });
  } else {
    books.length = 0;
    resetBtn.hidden = true;
  }
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function getStorage() {
  return localStorage.getItem('books');
}
function setStorage(val) {
  localStorage.setItem('books', JSON.stringify(bookList));
}

function createBooksList(book) {
  const title = document.createElement('h3');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.innerText = book.author;

  const year = document.createElement('p');
  year.innerText = book.year;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('red');
  deleteBtn.innerText = 'Hapus Buku';
  deleteBtn.addEventListener('click', () => {
    deleteBook(book.id);
  });

  const editBtn = document.createElement('button');
  editBtn.classList.add('orange');
  editBtn.innerText = 'Edit Buku';
  editBtn.addEventListener('click', () => {
    updateBook(book.id);
  });

  const action = document.createElement('div');
  action.classList.add('action');
  action.append(deleteBtn, editBtn);

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(title, author, year, action);

  if (!book.isComplete) {
    const completeBtn = document.createElement('button');
    completeBtn.classList.add('green');
    completeBtn.innerText = 'Selesai Baca';
    action.append(completeBtn);
    completeBtn.addEventListener('click', () => {
      completeReadBook(book.id);
    });
  } else {
    const undoBtn = document.createElement('button');
    undoBtn.classList.add('green');
    undoBtn.innerText = 'Belum Selesai Baca';
    action.append(undoBtn);
    undoBtn.addEventListener('click', () => {
      undoReadBook(book.id);
    });
  }
  return article;
}
function completeReadBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    bookList[findBook].isComplete = true;
    setStorage(bookList);
  }
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function undoReadBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    bookList[findBook].isComplete = false;
    setStorage(bookList);
  }
  document.dispatchEvent(new Event(RENDER_BOOKS));
}

function updateBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    updateBookModal(findBook);
  }
}

function deleteBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    deleteBookModal(findBook);
  }
}

function updateBookModal(book) {
  document.getElementById('overlay').style.display = 'block';
  document.querySelector('body').style.overflow = 'hidden';
  const modal = document.getElementById('modal');
  modal.innerHTML = '';

  const form = document.getElementById('formInput');
  const clonedForm = form.cloneNode(true);
  clonedForm.style.border = 0;
  clonedForm.style.textAlign = 'left';

  const btn = clonedForm.querySelector('#bookSubmit');
  const headerTitle = clonedForm.querySelector('h2');

  btn.parentNode.removeChild(btn);
  headerTitle.innerText = 'Update Buku';

  const body = document.createElement('div');
  body.classList.add('body');
  body.append(clonedForm);

  const title = clonedForm.querySelector('#inputBookTitle');
  const author = clonedForm.querySelector('#inputBookAuthor');
  const year = clonedForm.querySelector('#inputBookYear');
  const isCompleteInput = clonedForm.querySelector('#inputBookIsComplete');

  title.value = bookList[book].title;
  author.value = bookList[book].author;
  year.value = bookList[book].year;
  isCompleteInput.checked = bookList[book].isComplete;

  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Batal';
  cancelBtn.style.backgroundColor = 'rgb(100, 214, 145)';
  cancelBtn.addEventListener('click', () => {
    document.dispatchEvent(new Event(RENDER_BOOKS));
  });

  const updateBtn = document.createElement('button');
  updateBtn.innerText = 'Update';
  updateBtn.style.backgroundColor = 'rgb(245, 160, 48)';
  updateBtn.addEventListener('click', () => {
    const bookObject = {
      id: bookList[book].id,
      title: title.value,
      author: author.value,
      year: year.value,
      isComplete: isCompleteInput.checked
    };
    bookList.push(bookObject);
    setStorage(bookList);
    document.dispatchEvent(new Event(RENDER_BOOKS));
  });

  footer.append(cancelBtn, updateBtn);

  modal.append(body, footer);

  return modal;
}

function deleteBookModal(id) {
  document.getElementById('overlay').style.display = 'block';
  document.querySelector('body').style.overflow = 'hidden';
  const modal = document.getElementById('modal');
  modal.innerHTML = '';

  const header = document.createElement('h3');
  header.classList.add('header');
  header.innerText = 'Peringatan!';

  const body = document.createElement('div');
  body.classList.add('body');

  const p = document.createElement('p');
  p.innerHTML = `apakah anda ingin menghapus judul <br> <b>${bookList[id].title}</b>`;
  body.append(p);

  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Batal';
  cancelBtn.style.backgroundColor = 'rgb(100, 214, 145)';
  cancelBtn.addEventListener('click', () => {
    document.dispatchEvent(new Event(RENDER_BOOKS));
  });

  const removeBtn = document.createElement('button');
  removeBtn.innerText = 'Hapus';
  removeBtn.style.backgroundColor = 'rgb(185, 49, 49)';
  removeBtn.addEventListener('click', () => {
    bookList.splice(id, 1);
    setStorage(bookList);
    document.dispatchEvent(new Event(RENDER_BOOKS));
  });

  footer.append(cancelBtn, removeBtn);

  modal.append(header, body, footer);

  return modal;
}
