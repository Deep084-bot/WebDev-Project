# Social Media Web Development Project

## Description
A social media platform where users can register, log in, update profiles, and interact through posts. Built with Node.js, Express, and MongoDB.

## Features
- User Registration and Login
- Profile Management (Bio, Birthdate, Profile Picture)
- Main Page with User Posts
- Dark Mode Toggle
- Settings Page for Account Management

## Project Structure

devconnect/
├── public/
│   ├── index.html           # Feed page
│   ├── login.html
│   ├── signup.html
│   ├── profile.html
│   ├── explore.html
│   └── style.css
├── js/
│   ├── main.js              # Feed logic
│   ├── auth.js              # Login/signup logic
│   ├── profile.js
│   └── api.js               # Fetch backend APIs
├── server/
│   ├── index.js             # Express server
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── db.js
├── .env
├── package.json
└── README.md
