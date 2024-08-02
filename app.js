// book Constructor

class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Constructor

class UI {
  addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");

    row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td class = "action-btns">
          <span id ="edit" class ="btn btn-dark">Edit</span> 
          <span id ="delete" class ="btn btn-danger">X</span> 
         </td>`;

    list.appendChild(row);
  }

  showAlert(message, type) {
    this.clearAlert();

    const div = document.createElement("div");

    div.className = `alert alert-${type}`;

    div.innerText = message;

    document.querySelector(".show-alert").appendChild(div);

    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }

  clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  clearTasks() {
    document.querySelector("#book-list").innerHTML = "";
  }

  deleteBook(item) {
    item.parentElement.remove();
  }
}

class Storage {
  getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  addBooks(book) {
    const books = this.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  displayBooks() {
    const books = this.getBooks();

    const ui = new UI();

    books.forEach((book) => ui.addBookToList(book));
  }

  removeBook(isbn) {
    const books = this.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
  clearBooks() {
    localStorage.removeItem("books");
  }
}

const storage = new Storage();

// display books on load
document.addEventListener("DOMContentLoaded", () => storage.displayBooks());
// Event listen for submit

document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validate
  const ui = new UI();
  const storage = new Storage();

  if (title === "" || author === "" || isbn === "") {
    ui.showAlert("Please Fill All The Fileds", "danger");
  } else {
    let bookExist = false;

    const books = document.querySelectorAll("#book-list tr");

    for (const bookRow of books) {
      const existingTitle = bookRow.querySelector("td:nth-child(1)").innerText;
      const existingIsbn = bookRow.querySelector("td:nth-child(3)").innerText;

      if (existingTitle === title || existingIsbn === isbn) {
        bookExist = true;
        break;
      }
    }
    if (bookExist) {
      ui.showAlert(
        "Book with Same Title or ISBN they Already Exist ",
        "danger"
      );
    } else {
      const book = new Book(title, author, isbn);

      ui.addBookToList(book);

      ui.showAlert("Book Added Successfully!", "success");

      storage.addBooks(book);

      ui.clearFields();
    }
  }
});

// event listener for delete
document.querySelector("#book-list").addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("action-btns")) {
    const isbn = e.target.parentElement.previousElementSibling.innerText;
    console.log(isbn);
    const ui = new UI();
    const storage = new Storage();

    ui.deleteBook(e.target.parentElement);

    storage.removeBook(isbn);

    ui.showAlert("Book Has Been Deleted", "success");
  }
});

// Clear All

document.querySelector("#clear").addEventListener("click", (e) => {
  const ui = new UI();
  const storage = new Storage();

  ui.clearTasks();

  storage.clearBooks();

  ui.showAlert("All Books Are Cleared", "success");
});
