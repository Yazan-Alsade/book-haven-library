import { News_API_URL } from "../config/api.js";

document.querySelector('.logo').onclick = () => location.href = '../';

const links = document.querySelectorAll("header a");
links.forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add("active");
    }
});

const newsLatter = document.querySelector('footer form');

const sendEmail = async (email) => {
    try {
        const response = await fetch(News_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert("Message sent successfully");
        } else {
            alert("Failed to send message. Please try again!");
        }
    } catch (error) {
        alert("Something went wrong, try again!");
        console.log(error.message);
    } finally {
        newsLatter.reset();
    }
};

newsLatter.onsubmit = (event) => {
    event.preventDefault();
    const email = document.querySelector('footer form input').value.trim();
    if (email === "") {
        alert("The field is required");
    } else {
        sendEmail(email);
    }
};