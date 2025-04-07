const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// ✅ Allow cross-origin requests from frontend
app.use(cors({
    origin: ['http://localhost:3002', 'http://127.0.0.1:3002'], // Allow both localhost and 127.0.0.1
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow credentials (if needed)
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files like images
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Ensure uploads directory exists
}
app.use('/uploads', express.static(uploadsDir));

// Serve static files from the frontend directory
const frontendDir = path.join(__dirname, '../frontend');
app.use(express.static(frontendDir));

// Connect MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/socialMediaDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// MongoDB Schema
const profileSchema = new mongoose.Schema({
    name: String,
    gender: String,
    birthdate: String,
    bio: String,
    imageUrl: String,
});

const Profile = mongoose.model('Profile', profileSchema);

// Save profile data
app.post('/profile', upload.single('image'), async (req, res) => {
    const { name, gender, birthdate, bio } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        const profile = new Profile({
            name, gender, birthdate, bio, imageUrl
        });
        await profile.save();
        res.json({ message: "Profile saved successfully!" });
    } catch (err) {
        console.error("Error saving profile:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(3000, () => console.log("Profile server running at http://localhost:3000"));
