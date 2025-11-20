// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const classRoutes = require('./routes/classes');
const marksRoutes = require('./routes/marks');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/marks', marksRoutes);

// simple health check
app.get('/', (req, res) => res.send({ ok: true, message: 'Student Performance API' }));

module.exports = app;
