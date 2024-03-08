const bookList = JSON.parse(getStorage()) || [];
const books = [];
const RENDER_EVENT = 'render-books';
const searchVal = document.getElementById('searchBookTitle');

document.addEventListener('DOMContentLoaded', () => {
  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });
  searchVal.addEventListener('input', searchBook);
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.addEventListener(RENDER_EVENT, () => {
  const incomplete = document.getElementById('incompleteBookshelfList');
  const complete = document.getElementById('completeBookshelfList');

  incomplete.innerHTML = '';
  complete.innerHTML = '';

  if (searchVal.value.length > 0) {
    books.forEach((el) => {
      let createBooks = createBooksList(el);
      if (!el.isCompleted) {
        incomplete.append(createBooks);
      } else {
        complete.append(createBooks);
      }
    });
  } else {
    bookList.forEach((el) => {
      let createBooks = createBooksList(el);
      if (!el.isCompleted) {
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
    isCompleted: isCompleteInput
  };
  bookList.push(bookObject);
  setStorage(bookList);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook(e) {
  e.preventDefault();
  const resetBtn = document.getElementById('reset');
  if (searchVal.value.length > 2) {
    bookList.forEach((element) => {
      if (element.title.match(new RegExp(searchVal.value, 'i'))) {
        books.push(element);
      }
    });
    resetBtn.hidden = false;
    resetBtn.addEventListener('click', () => {
      books.length = 0;
      resetBtn.hidden = true;
      resetBtn.value = 0;
    });
  } else {
    books.length = 0;
    resetBtn.hidden = true;
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
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

  const action = document.createElement('div');
  action.classList.add('action');
  action.append(deleteBtn);

  const article = document.createElement('article');
  article.classList.add('book_item');
  article.append(title, author, year, action);

  if (!book.isCompleted) {
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
    bookList[findBook].isCompleted = true;
    setStorage(bookList);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoReadBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    bookList[findBook].isCompleted = false;
    setStorage(bookList);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function deleteBook(id) {
  let findBook = bookList.findIndex((data) => data.id == id);
  if (findBook !== -1) {
    deleteModal(findBook);
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function editModal(book) {}

function deleteModal(id) {
  const modal = document.getElementById('modal');
  modal.innerHTML = '';

  const header = document.createElement('h3');
  header.classList.add('header');
  header.innerText = 'Peringatan!';

  const body = document.createElement('div');
  body.classList.add('body');

  const p = document.createElement('p');
  p.innerText = `apakah anda ingin menghapus judul ${bookList[id].title}`;
  body.append(p);

  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const cancelBtn = document.createElement('button');
  cancelBtn.innerText = 'Batal';
  cancelBtn.addEventListener('click', () => {
    modal.innerHTML = '';
  });

  const removeBtn = document.createElement('button');
  removeBtn.innerText = 'Hapus';
  removeBtn.addEventListener('click', () => {
    console.log(bookList[id]);
    //   bookList.splice(findBook, 1);
    // setStorage(bookList);
  });

  footer.append(cancelBtn, removeBtn);

  modal.append(header, body, footer);

  return modal;
}
