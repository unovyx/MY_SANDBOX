/* API CONFIGURATION */

const API_URL = "https://my-sandbox-backend-aqs9.onrender.com";


/* SLIDESHOW */

let currentSlide = 0;
let slideTimer;

function showSlide(index) {
    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) {
        return;
    }

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
    resetSlideTimer();
}

function previousSlide() {
    showSlide(currentSlide - 1);
    resetSlideTimer();
}

function startSlideTimer() {
    slideTimer = setInterval(function() {
        showSlide(currentSlide + 1);
    }, 5000);
}

function resetSlideTimer() {
    clearInterval(slideTimer);
    startSlideTimer();
}


/* AUTHENTICATION */

function showLogin() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    }

    clearMessage();
}

function showRegister() {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
    }

    clearMessage();
}


/* LOGIN */

async function login(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const remember = document.getElementById("remember").checked;
    const message = document.getElementById("message");

    clearMessage();

    if (email === "" || password === "") {
        message.textContent = "Please enter your email and password.";
        return;
    }

    try {
        message.textContent = "Signing in...";

        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Login failed.";
            return;
        }

        /* SAVE TOKEN */

        if (remember) {
            localStorage.setItem(
                "authToken",
                data.token
            );

            sessionStorage.removeItem(
                "authToken"
            );

        } else {
            sessionStorage.setItem(
                "authToken",
                data.token
            );

            localStorage.removeItem(
                "authToken"
            );
        }

        /* SAVE USER INFORMATION */

        localStorage.setItem(
            "userName",
            data.user.name
        );

        localStorage.setItem(
            "userEmail",
            data.user.email
        );

        message.textContent = "Login successful!";

        /* GO TO MEMBERS PAGE */

        setTimeout(function() {
            window.location.href = "members.html";
        }, 500);

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        message.textContent =
            "Cannot connect to the server.";
    }
}


/* REGISTER */

async function register(event) {
    event.preventDefault();

    const name =
        document.getElementById("fullName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");

    clearMessage();

    /* CHECK FIELDS */

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirm === ""
    ) {
        message.textContent =
            "Please complete all fields.";

        return;
    }

    /* CHECK PASSWORD LENGTH */

    if (password.length < 8) {
        message.textContent =
            "Password must be at least 8 characters.";

        return;
    }

    /* CHECK PASSWORD MATCH */

    if (password !== confirm) {
        message.textContent =
            "Passwords do not match.";

        return;
    }

    try {

        message.textContent =
            "Creating your account...";

        const response = await fetch(
            `${API_URL}/api/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent =
                data.message ||
                "Registration failed.";

            return;
        }

        message.textContent =
            "Account created successfully! You can now sign in.";

        /* CLEAR REGISTER FORM */

        document.getElementById(
            "fullName"
        ).value = "";

        document.getElementById(
            "registerEmail"
        ).value = "";

        document.getElementById(
            "registerPassword"
        ).value = "";

        document.getElementById(
            "confirmPassword"
        ).value = "";

        /* SHOW LOGIN */

        setTimeout(function() {

            showLogin();

            document.getElementById(
                "loginEmail"
            ).value = email;

        }, 1200);

    } catch (error) {

        console.error(
            "Registration error:",
            error
        );

        message.textContent =
            "Cannot connect to the server.";
    }
}


/* PASSWORD */

function togglePassword(inputId, button) {

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "Hide";

        button.setAttribute(
            "aria-label",
            "Hide password"
        );

    } else {

        input.type = "password";

        button.textContent = "Show";

        button.setAttribute(
            "aria-label",
            "Show password"
        );
    }
}


/* FORGOT PASSWORD */

function forgotPassword() {

    const emailInput =
        document.getElementById("loginEmail");

    const message =
        document.getElementById("message");

    if (!emailInput || !message) {
        return;
    }

    const email =
        emailInput.value.trim();

    if (email === "") {

        message.textContent =
            "Enter your email first to reset your password.";

        return;
    }

    message.textContent =
        "Password reset is not available yet.";
}


/* MESSAGE */

function clearMessage() {

    const message =
        document.getElementById("message");

    if (message) {
        message.textContent = "";
    }
}


/* START */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showSlide(0);

        startSlideTimer();

    }
);
