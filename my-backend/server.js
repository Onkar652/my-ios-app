// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // loads .env file for environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // parses incoming JSON bodies
app.use(cors());  // enables CORS for cross-origin requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
