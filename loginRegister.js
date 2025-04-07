// Toggle between login and register pages
function toggleForm(isLoginPage) {
    if (isLoginPage) {
        window.location.href = "register.html"; // Redirect to register page
    } else {
        window.location.href = "login.html"; // Redirect to login page
    }
}

// Handle Login and Register
async function handleAuth(event, isLogin) {
    event.preventDefault();
    
    const username = document.getElementById("un").value.trim();
    const password = document.getElementById("pw").value.trim();

    if (!username || !password) {
        alert("lease fill in all fields!");
        return;
    }

    const endpoint = isLogin ? "/login" : "/register";
    const response = await fetch("http://localhost:5000" + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
        if (isLogin) {
            alert("Login successful! Redirecting...");
            localStorage.setItem("token", result.token);
            localStorage.setItem("username", username);
            window.location.href = "mainPage.html"; // Redirect to main page
        } else {
            alert("Registration successful! You can now log in.");
            window.location.href = "profile.html"; // Redirect to login page
        }
    } else {
        alert("" + result.message);
    }
}