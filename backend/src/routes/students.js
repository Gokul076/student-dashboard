// src/routes/students.js
const express = require('express');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// create student
router.post('/', auth, async (req, res) => {
  try {
    const s = new Student(req.body);
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list students (with optional class filter)
router.get('/', auth, async (req, res) => {
  try {
    const { classId, q } = req.query;
    const filter = {};
    if (classId) filter.classId = classId;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const students = await Student.find(filter).limit(500);
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
