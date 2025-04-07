const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);
const db = client.db('socialMediaDB');
const profiles = db.collection('profiles');

// Serve profile pics from uploads folder
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
router.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// GET user profile
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await profiles.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// POST update profile
router.post('/updateProfile', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, name, gender, dob, about } = req.body;
    const update = { name, gender, dob, about };

    if (req.file) {
      update.profilePic = `/uploads/${req.file.filename}`;
    }

    await profiles.updateOne(
      { username },
      { $set: update },
      { upsert: true }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
