const username = localStorage.getItem("username");

async function loadProfile() {
  try {
    const response = await fetch(`http://localhost:3000/profile/${username}`);
    const data = await response.json();

    document.getElementById("name").value = data.name || "";
    document.getElementById("gender").value = data.gender || "";
    document.getElementById("dob").value = data.dob ? data.dob.slice(0, 10) : "";
    document.getElementById("about").value = data.about || "";
    document.getElementById("profile-pic").src = data.profilePic || "/frontend/assets/default.jpg";
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Could not fetch profile.");
  }
}

document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(document.getElementById("profile-form"));
  form.append("username", username);

  try {
    const res = await fetch("http://localhost:3000/updateProfile", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    alert(data.message);
    loadProfile();
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile.");
  }
});

function logout() {
  localStorage.removeItem("username");
  window.location.href = "/frontend/pages/login.html";
}

window.onload = loadProfile;
