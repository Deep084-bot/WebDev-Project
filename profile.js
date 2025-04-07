document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('un').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.id;
    const birthdate = document.getElementById('bd').value;
    const bio = document.querySelector('textarea').value;
    const imageFile = document.getElementById('imageInput').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('birthdate', birthdate);
    formData.append('bio', bio);
    formData.append('image', imageFile);

    try {
        const response = await fetch('http://localhost:3000/profile', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to save profile");
        }

        const result = await response.json();
        alert(result.message || "Profile updated successfully!");

        console.log("Redirecting to mainPage.html...");
        window.location.href = "http://127.0.0.1:3002/frontend/pages/mainPage.html";
    } catch (err) {
        console.error("Error submitting profile:", err);
        alert("An error occurred while submitting the profile. Please try again.");
    }
});
