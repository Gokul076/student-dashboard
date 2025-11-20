// src/models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  rollNumber: Number,
  dob: Date,
  gender: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
