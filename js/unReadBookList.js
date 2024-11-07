import { API_URL } from "../config/api.js";

let booksWrapper = document.getElementById("books_wrapper");
let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchButton");
let loadingMessage = document.getElementById("loadingMessage");

async function getBooks(searchTerm) {
  let response = await fetch(`${API_URL}?isReading=false&q=${searchTerm}`);
  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    return [];
  }
  let booksData = await response.json();
  return booksData;
}
async function displayBooks(searchTerm = "") {
  let books = await getBooks(searchTerm);

  let filteredBooks = books.filter((book) => {
    let isMatch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatch;
  });

  let tempBooksHolder = filteredBooks.map(
    (book) => ` 
      <div class="book-card" id="book-${book.id}">
        <img src="${book.img}" alt="${book.title}">
        <h2>${book.title}</h2>
        <p class="author row"><span>By: </span>${book.author}</p>
        <p class="genre row"><span>Genre: </span>${book.genre}</p>
        <p class="description">${book.description}</p>
      </div>`
  );

  booksWrapper.innerHTML = tempBooksHolder.join("");
}

displayBooks();

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  displayBooks(searchTerm);
});
