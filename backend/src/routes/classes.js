// src/routes/classes.js
const express = require('express');
const mongoose = require('mongoose');
const Class = require('../models/Class');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const c = new Class(req.body);
    await c.save();
    res.status(201).json(c);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/classes/:id - return class details and students in that class
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid class id' });
    const klass = await Class.findById(id).lean();
    if (!klass) return res.status(404).json({ error: 'Class not found' });

    // also include students in this class (lightweight fields)
    const students = await Student.find({ classId: id }).select('name registerNumber _id').limit(1000).lean();
    klass.students = students;
    res.json(klass);
  } catch (err) {
    console.error('Get class error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
