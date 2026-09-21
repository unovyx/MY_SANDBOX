/* API CONFIGURATION */

const API_URL = "https://my-sandbox-backend.onrender.com";


/* =========================
   LOGIN
========================= */

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    const message = document.getElementById("loginMessage");

    if (!email || !password) {
        message.textContent = "Please enter your email and password.";
        message.style.color = "red";
        return;
    }

    try {

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
            message.style.color = "red";
            return;
        }

        if (remember) {
            localStorage.setItem("token", data.token);
        } else {
            sessionStorage.setItem("token", data.token);
        }

        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        message.textContent = "Login successful!";
        message.style.color = "green";

        setTimeout(() => {
            window.location.href = "members.html";
        }, 500);

    } catch (error) {

        console.error("Login error:", error);

        message.textContent = "Cannot connect to server.";
        message.style.color = "red";
    }
}


/* =========================
   REGISTER
========================= */

async function register() {

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const message = document.getElementById("registerMessage");

    if (!name || !email || !password) {
        message.textContent = "Please complete all fields.";
        message.style.color = "red";
        return;
    }

    if (password.length < 8) {
        message.textContent = "Password must be at least 8 characters.";
        message.style.color = "red";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message || "Registration failed.";
            message.style.color = "red";
            return;
        }

        message.textContent = "Registration successful!";
        message.style.color = "green";

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

    } catch (error) {

        console.error("Registration error:", error);

        message.textContent = "Cannot connect to server.";
        message.style.color = "red";
    }
}


/* =========================
   FORGOT PASSWORD
========================= */

function forgotPassword() {

    alert("Password reset is currently unavailable.");

}


/* =========================
   TOGGLE PASSWORD
========================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";

        if (button) {
            button.textContent = "Hide";
        }

    } else {

        input.type = "password";

        if (button) {
            button.textContent = "Show";
        }
    }
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    window.location.href = "index.html";
}


/* =========================
   CHECK LOGIN
========================= */

function checkLogin() {

    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    return token;
}


/* =========================
   LOAD PROFILE
========================= */

async function loadProfile() {

    const token = checkLogin();

    if (!token) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {

            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            window.location.href = "index.html";

            return;
        }

        const nameElement = document.getElementById("userName");
        const emailElement = document.getElementById("userEmail");

        if (nameElement) {
            nameElement.textContent = data.user.name;
        }

        if (emailElement) {
            emailElement.textContent = data.user.email;
        }

    } catch (error) {

        console.error("Profile error:", error);

        alert("Cannot connect to server.");
    }
}


/* =========================
   SLIDESHOW
========================= */

let currentSlide = 0;

function showSlide(index) {

    const slides = document.querySelectorAll(".slide");

    if (!slides.length) {
        return;
    }

    if (index >= slides.length) {
        currentSlide = 0;
    }

    if (index < 0) {
        currentSlide = slides.length - 1;
    }

    slides.forEach((slide) => {
        slide.style.display = "none";
    });

    slides[currentSlide].style.display = "block";
}


function nextSlide() {

    currentSlide++;

    showSlide(currentSlide);
}


function previousSlide() {

    currentSlide--;

    showSlide(currentSlide);
}


function startSlideshow() {

    showSlide(currentSlide);

    setInterval(() => {
        nextSlide();
    }, 5000);
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {

    startSlideshow();

});

