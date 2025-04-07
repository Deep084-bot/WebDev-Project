const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

// 📌 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/socialMediaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", UserSchema);

// ✅ Update Username
app.put("/settings/update-username", async (req, res) => {
    const { oldUsername, newUsername } = req.body;

    if (!oldUsername || !newUsername) {
        return res.status(400).json({ error: "Both usernames required." });
    }

    try {
        const user = await User.findOne({ username: oldUsername });
        if (!user) return res.status(404).json({ error: "User not found" });

        const existing = await User.findOne({ username: newUsername });
        if (existing) return res.status(400).json({ error: "Username already taken" });

        user.username = newUsername;
        await user.save();
        return res.json({ message: "✅ Username updated successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Update Password
app.put("/settings/update-password", async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect old password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();
        return res.json({ message: "✅ Password updated successfully!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Delete Account
app.delete("/settings/delete-account", async (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: "Username required" });

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        await User.deleteOne({ username });
        return res.json({ message: "✅ Account deleted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
