
import { API_URL } from "../config/api.js";

document.querySelector(".left-info").onclick = () => { location.href = "../pages/addBook.html" };
document.querySelector(".right-info").onclick = () => { location.href = "../pages/readingBooks.html" };

async function fetchBooks() {
    await Promise.all([fetchReadingBooks(), fetchUnreadBooks()]);
}

function showLoadingSpinner(section) {
    document.getElementById(`${section}-loading-spinner`).style.display = "block";
}

function hideLoadingSpinner(section) {
    document.getElementById(`${section}-loading-spinner`).style.display = "none";
}

async function fetchReadingBooks() {
    showLoadingSpinner("reading");
    try {
        const response = await fetch(`${API_URL}?isReading=true&_limit=5`);
        if (!response.ok) throw new Error("Failed to fetch reading books.");
        const books = await response.json();
        displayReadingBooks(books);
    } catch (error) {
        console.error("Error fetching reading books:", error);
        document.getElementById("reading-list").innerHTML = "<p class='error-message'>Failed to load reading books. Please try again later.</p>";
    } finally {
        hideLoadingSpinner("reading");
    }
}

async function fetchUnreadBooks() {
    showLoadingSpinner("unread");
    try {
        const response = await fetch(`${API_URL}?isReading=false&_limit=5`);
        if (!response.ok) throw new Error("Failed to fetch unread books.");
        const books = await response.json();
        displayUnreadBooks(books);
    } catch (error) {
        console.error("Error fetching unread books:", error);
        document.getElementById("to-read-list").innerHTML = "<p class='error-message'>Failed to load unread books. Please try again later.</p>";
    } finally {
        hideLoadingSpinner("unread");
    }
}

function displayReadingBooks(books) {
    const list = document.getElementById("reading-list");
    list.innerHTML = "";
    if (books.length === 0) {
        list.innerHTML = "<p class='empty-message'>No data available</p>";
    } else {
        books.forEach(book => {
            const bookElement = createBookElement(book);
            list.appendChild(bookElement);
        });
    }
}

function displayUnreadBooks(books) {
    const list = document.getElementById("to-read-list");
    list.innerHTML = "";
    if (books.length === 0) {
        list.innerHTML = "<p class='empty-message'>No data available</p>";
    } else {
        books.forEach(book => {
            const bookElement = createBookElement(book);
            list.appendChild(bookElement);
        });
    }
}

function createBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-reading-info");
    bookElement.setAttribute("data-id", book.id);
    bookElement.setAttribute("data-isReading", book.isReading);

    bookElement.innerHTML = `
        <img src="${book.img}" alt="${book.title}">
        <h5>${book.title}</h5>
        <span style="color:#626262">${book.genre}</span>
        <div class="favorite-book">
            <span>by ${book.author}</span>
            <span class="mark-reading-icon" style="font-size:19px;cursor:pointer;">
                ${book.isReading ?
            '<i class="fas fa-book-open" style="color:orange;font-size:19px;"></i>' :
            '<i class="fas fa-book"></i>'}
            </span>
            <span id="delete" class="delete-icon" style="font-size:17px;cursor:pointer; margin-left: 10px;">
                <i class="fas fa-trash"></i>
            </span>
        </div>
        <p style="color:#888">${book.description}</p>
    `;

    const markReadingIcon = bookElement.querySelector(".mark-reading-icon");
    markReadingIcon.addEventListener("click", (event) => {
        event.preventDefault();
        toggleReadingStatus(bookElement);
    });

    const deleteIcon = bookElement.querySelector(".delete-icon");
    deleteIcon.addEventListener("click", (event) => {
        event.preventDefault();
        deleteBook(bookElement);
    });

    return bookElement;
}

async function toggleReadingStatus(bookElement) {
    const bookId = bookElement.getAttribute("data-id");
    const isCurrentlyReading = bookElement.getAttribute("data-isReading") === "true";

    try {
        await fetch(`${API_URL}/${bookId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isReading: !isCurrentlyReading })
        });

        if (isCurrentlyReading) {
            document.getElementById("to-read-list").appendChild(bookElement);
        } else {
            document.getElementById("reading-list").appendChild(bookElement);
        }

        bookElement.setAttribute("data-isReading", !isCurrentlyReading);
        const icon = bookElement.querySelector(".mark-reading-icon i");
        if (isCurrentlyReading) {
            icon.classList.replace("fa-book-open", "fa-book");
            icon.style.color = "";
        } else {
            icon.classList.replace("fa-book", "fa-book-open");
            icon.style.color = "orange";
        }
        fetchBooks();

    } catch (error) {
        console.error("Error updating reading status:", error);
    }
}

async function deleteBook(bookElement) {
    const bookId = bookElement.getAttribute("data-id");

    try {
        await fetch(`${API_URL}/${bookId}`, {
            method: "DELETE",
        });

        bookElement.remove();
        fetchBooks();
    } catch (error) {
        console.error("Error deleting book:", error);
    }
}

fetchBooks();

