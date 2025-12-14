console.log("auth.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;
            const confirm = document.getElementById("signup-confirm").value;

            if (!email || !password) {
                alert("Missing fields");
                return;
            }

            if (password !== confirm) {
                alert("Passwords do not match");
                return;
            }

            const users = JSON.parse(localStorage.getItem("users")) || {};

            users[email] = { password };
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("loggedInUser", email);

            console.log("Signup success");
            window.location.href = "index.html";
        });
    }

    
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            const users = JSON.parse(localStorage.getItem("users")) || {};

            if (!users[email] || users[email].password !== password) {
                alert("Wrong login data");
                return;
            }

            localStorage.setItem("loggedInUser", email);

            console.log("Login success");
            window.location.href = "index.html";
        });
    }

});


document.addEventListener("DOMContentLoaded", () => {

    const forgotLink = document.getElementById("forgot-password");
    console.log("forgotLink:", forgotLink);

    if (!forgotLink) {
        console.error("Forgot password link NOT found");
        return;
    }

    forgotLink.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Forgot password clicked ✅");
    });

});


