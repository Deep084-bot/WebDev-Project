const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection URI
const mongoURI = 'mongodb://127.0.0.1:27017';
const dbName = 'socialMediaDB';
let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/frontend', express.static(path.join(__dirname, 'public/frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    console.log('✅ Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Dummy Data Route: Returns fake profile if not found
app.get('/getProfile/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const profile = await db.collection('profiles').findOne({ username });

    if (!profile) {
      // Return dummy profile if not found
      return res.json({
        username,
        name: "Dummy User",
        gender: "Other",
        dob: "2000-01-01",
        about: "This is a dummy profile.",
        profilePicture: "" // No image
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching profile');
  }
});

// Route to update profile
app.post('/updateProfile', async (req, res) => {
  try {
    const { username, name, gender, dob, about } = req.body;

    const result = await db.collection('profiles').updateOne(
      { username },
      {
        $set: {
          name,
          gender,
          dob,
          about
        }
      },
      { upsert: true }
    );

    res.send({ success: true, updated: result.modifiedCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating profile');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
