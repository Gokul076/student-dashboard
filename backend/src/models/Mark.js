// src/models/Mark.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  code: String,
  name: String,
  marksObtained: Number,
  maxMarks: Number
}, { _id: false });

const MarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  exam: {
    name: String,
    date: Date
  },
  subjects: [SubjectSchema],
  totalObtained: Number,
  totalMax: Number,
  percentage: Number,
  createdAt: { type: Date, default: Date.now }
});

MarkSchema.pre('save', function(next) {
  const totalObtained = this.subjects.reduce((s, sub) => s + (Number(sub.marksObtained)||0), 0);
  const totalMax = this.subjects.reduce((s, sub) => s + (Number(sub.maxMarks)||0), 0);
  this.totalObtained = totalObtained;
  this.totalMax = totalMax;
  this.percentage = totalMax ? (totalObtained / totalMax) * 100 : 0;
  next();
});

module.exports = mongoose.model('Mark', MarkSchema);
