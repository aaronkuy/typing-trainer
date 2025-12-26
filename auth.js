//Fetch the HTML element to JS
const signupForm = document.getElementById("signup-form");
//Prevent that the signup button can be pressed without enterd data
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
//Fetch HTML elements and allocate it to JS variables 
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const confirm = document.getElementById("signup-confirm").value;
//Test if the user is typing the same password 
        if (password !== confirm) {
            alert("Passwords do not match");
            return;
        }

//Create our local host user array 
        const user = {
            email: email,
            password: password
        };

//Converts user to a JSON string 
        localStorage.setItem("user", JSON.stringify(user));
//User is logged in, setting
        localStorage.setItem("loggedIn", "true");

//Forwarded to the typing trainer website      
        window.location.href = "index.html";
    });
}

//Fetch the HTML elements of the login page
const loginForm = document.getElementById("logic-form");
//Prevent that the user can click the login button before typing the data 
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
//Here we are colloecting the user typed information to JS variables 
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
//New Cache if the user typed in login information 
        const storedUser = JSON.parse(localStorage.getItem("user"));
//Catch the individuality that the user typed in wrong accound data 
        if (!storedUser) {
            alert("No account found. Please sign up first.");
            return;
        }
//Only if the data in storedUser are true forward to the typing trainer website,
//else alert for UX
        if (email === storedUser.email && password === storedUser.password) {
            localStorage.setItem("loggedIn", "true");
            window.location.href = "index.html";
        } else {
            alert("Wrong email or password");
        }
    });
}


