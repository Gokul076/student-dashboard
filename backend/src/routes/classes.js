// src/routes/classes.js
const express = require('express');
const Class = require('../models/Class');
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

module.exports = router;
