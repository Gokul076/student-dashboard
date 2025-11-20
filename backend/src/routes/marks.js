// src/routes/marks.js
const express = require('express');
const Mark = require('../models/Mark');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// create mark record
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, classId, exam, subjects } = req.body;
    const mark = new Mark({ studentId, classId, exam, subjects });
    await mark.save();
    res.status(201).json(mark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// get marks by student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const marks = await Mark.find({ studentId }).sort({ 'exam.date': 1 });
    res.json(marks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// class-level trend aggregation
router.get('/analytics/class/:classId/trends', auth, async (req, res) => {
  try {
    const { classId } = req.params;
    const results = await Mark.aggregate([
      { $match: { classId: mongoose.Types.ObjectId(classId) } },
      { $group: {
        _id: { examName: '$exam.name', examDate: '$exam.date' },
        avgPercent: { $avg: '$percentage' },
        minPercent: { $min: '$percentage' },
        maxPercent: { $max: '$percentage' }
      }},
      { $sort: { '_id.examDate': 1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
