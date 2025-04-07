document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Settings page loaded!");

    const darkModeToggle = document.getElementById("dark-mode");
    const newUsernameInput = document.getElementById("new-username");
    const saveUsernameButton = document.getElementById("save-username");
    const oldPasswordInput = document.getElementById("old-password");
    const newPasswordInput = document.getElementById("new-password");
    const savePasswordButton = document.getElementById("save-password");
    const deleteAccountButton = document.getElementById("delete-account");
    const logoutButton = document.getElementById("logout");

    let loggedInUser = localStorage.getItem("username");

    if (loggedInUser) {
        alert("No user found. Redirecting to login.");
        window.location.href = "login.html";
    } else {
        document.getElementById("username").textContent = `Welcome, ${loggedInUser}`;
    }

    // ✅ Load Dark Mode Preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    // ✅ Toggle Dark Mode
    darkModeToggle.addEventListener("change", function () {
        if (darkModeToggle.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("darkMode", "enabled");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("darkMode", "disabled");
        }
    });

    // ✅ Change Username
    saveUsernameButton.addEventListener("click", async function () {
        const newUsername = newUsernameInput.value.trim();
        if (!newUsername) {
            alert("Username cannot be empty!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/settings/update-username", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldUsername: loggedInUser, newUsername })
            });

            if (response.ok) {
                alert("Username updated successfully!");
                localStorage.setItem("username", newUsername);
                location.reload();
            } else {
                alert("Error updating username.");
            }
        } catch (error) {
            console.error("❌ Error updating username:", error);
        }
    });

    // ✅ Change Password
    savePasswordButton.addEventListener("click", async function () {
        const oldPassword = oldPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();

        if (!oldPassword || !newPassword) {
            alert("Both fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/settings/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loggedInUser, oldPassword, newPassword })
            });

            if (response.ok) {
                alert("Password updated successfully!");
                oldPasswordInput.value = "";
                newPasswordInput.value = "";
            } else {
                alert("Incorrect old password.");
            }
        } catch (error) {
            console.error("❌ Error updating password:", error);
        }
    });

    // ✅ Delete Account
    deleteAccountButton.addEventListener("click", async function () {
        if (!confirm("Are you sure you want to delete your account? This action is irreversible!")) return;

        try {
            const response = await fetch("http://localhost:5000/settings/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loggedInUser })
            });

            if (response.ok) {
                alert("Account deleted successfully.");
                localStorage.removeItem("username");
                window.location.href = "login.html";
            } else {
                alert("Error deleting account.");
            }
        } catch (error) {
            console.error("❌ Error deleting account:", error);
        }
    });

    // ✅ Logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
});
