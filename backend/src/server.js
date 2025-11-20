// src/server.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';
const MONGO_URI = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}
start();
