// src/models/Class.js
const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: Number,
  section: String,
  subjects: [{ code: String, name: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', ClassSchema);
