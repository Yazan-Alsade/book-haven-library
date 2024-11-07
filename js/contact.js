import { serviceId, templateId } from "../constant/emailJsId.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const formContact = document.getElementById("sendEmail");
const btnSubmit = document.querySelector(".btn button");
const error = document.querySelector(".error");
let isLoading = false;

const handleIsLoading = () => {
    btnSubmit.textContent = isLoading ? "Loading..." : "Submit";
    btnSubmit.disabled = isLoading;
};
handleIsLoading();
const handelError = (msg) => {
    error.textContent = msg;
};

const validateForm = (name, email, question) => {
    if (name === "" || email === "" || question === "") {
        return "All fields are required!";
    }
    if (!emailRegex.test(email)) {
        return "Enter a valid email!";
    }
};

const sendEmail = async (templateParams) => {
    isLoading = true;
    handleIsLoading();
    try {
        await emailjs.send(serviceId, templateId, templateParams);
        handelError("Message sent successfully");
        error.style.color = "#1e7024";
        setTimeout(() => {
            handelError("\u00A0");
            formContact.reset();
        }, 3000);
    } catch (error) {
        handelError("Oops, something went wrong, try again!");
        setTimeout(() => {
            handelError("\u00A0");
            formContact.reset();
        }, 3000);
    } finally {
        isLoading = false;
        handleIsLoading();
    }
};

formContact.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.querySelector("input[name=name]").value.trim();
    const email = document.querySelector("input[name=email]").value.trim();
    const question = document.querySelector("textarea").value.trim();
    const errorMessage = validateForm(name, email, question);

    if (errorMessage) {
        handelError(errorMessage);
    } else {
        const templateParams = {
            from_name: `My name is ${name} with email ${email}`,
            message: question,
        };
        sendEmail(templateParams);
    }
});
