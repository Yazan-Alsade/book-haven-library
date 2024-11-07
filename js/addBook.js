import { API_URL } from "./../config/api.js";

const form = document.querySelector("form");
let error = document.querySelector(".error");
let submitBtn = document.querySelector("button");
let isLoading = false;

const submitContent = () => {
    isLoading
        ? (submitBtn.textContent = "Loading...")
        : (submitBtn.textContent = "Submit");
};

const handleError = (errorMsg) => {
    error.style.visibility = "visible";
    error.style.opacity = 1;
    error.textContent = errorMsg;
};

async function addData(data) {
    isLoading = true;
    submitContent();
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            document.querySelector(".pop-up-message").style.top = "15rem";
            handleError("\u00A0")
            setTimeout(() => {
                document.querySelector(".pop-up-message").style.top = "-10rem";
                form.reset();
            }, 4000);
        }
    } catch (error) {
        handleError("Oops! something went wrong, try again :)");
    } finally {
        isLoading = false;
        submitContent();
    }
}

async function isExist(bookTitle, bookDetails) {
    isLoading = true;
    submitContent();
    try {
        const data = await fetch(`${API_URL}?q=${bookTitle}`);
        const response = await data.json();
        if (response[0]?.title.toLowerCase() === bookTitle.toLowerCase()) {
            handleError("The book is already exist :)!");
        } else {
            addData(bookDetails);
        }
    } catch (error) {
        handleError("Oops! something went wrong, try again :)");
    } finally {
        isLoading = false;
        submitContent();
    }
}
const validateForm = (title, author, genre, description, img) => {
    const urlRegex =
        /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
    const imgRegex = /\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i

    if (title === "" || author === "" || !genre || description === "" || img === "") {
        handleError("All fields are required!");
        return false
    } else if (!urlRegex.test(img)) {
        handleError("Enter valid URL!");
        if (!imgRegex.test(img)) {
            handleError("Enter URL for image");
        }
        return false
    }
    return true
};
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.querySelector('input[name="genre"]:checked')?.value;
    const description = document.getElementById("description").value.trim();
    const img = document.getElementById("bookCover").value.trim();

    if (validateForm(title, author, genre, description, img)) {
        const bookDetails = {
            title,
            author,
            genre,
            description,
            img,
            isReading: false,
        };
        isExist(title, bookDetails);
    }
});