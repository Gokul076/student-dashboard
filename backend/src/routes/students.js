// backend/src/routes/students.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { parse } = require('csv-parse');
const Student = require('../models/Student');
const auth = require('../middleware/auth');

const router = express.Router();

// multer setup - store uploads in /uploads (ensure folder exists)
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Helper: Basic student sanitizer/normalizer
 * Adjust fields based on your Student schema.
 */
function normalizeRow(row) {
  // Try to handle common header variations (Name, name, registerNumber, reg, reg_no...)
  return {
    name: (row.name || row.Name || row.student_name || '').trim(),
    registerNumber: (row.registerNumber || row.reg || row.reg_no || row.RegisterNumber || '').trim(),
    classId: (row.classId || row.class || row.class_name || '').trim(),
    // add more fields here if your Student schema contains them
  };
}

/**
 * Create student
 * POST /api/students/
 */
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body;

    // Basic validation (adjust according to your schema)
    if (!payload.name || !payload.registerNumber) {
      return res.status(400).json({ error: 'name and registerNumber are required' });
    }

    const s = new Student(payload);
    await s.save();
    return res.status(201).json(s);
  } catch (err) {
    console.error('Create student error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * List students (with optional class filter and search q)
 * GET /api/students?classId=...&q=...
 */
router.get('/', auth, async (req, res) => {
  try {
    const { classId, q } = req.query;
    const filter = {};
    if (classId) filter.classId = classId;
    if (q) {
      // search by name or registerNumber
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { registerNumber: { $regex: q, $options: 'i' } }
      ];
    }

    const students = await Student.find(filter).limit(1000).sort({ name: 1 });
    return res.json(students);
  } catch (err) {
    console.error('List students error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get single student by id
 * GET /api/students/:id
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    return res.json(s);
  } catch (err) {
    console.error('Get student error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Update student
 * PUT /api/students/:id
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const s = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ error: 'Student not found' });
    return res.json(s);
  } catch (err) {
    console.error('Update student error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Delete student
 * DELETE /api/students/:id
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Delete student error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/**
 * CSV upload for bulk students
 * POST /api/students/upload
 * Form field name: file
 * Requires auth
 */
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const records = [];
  const parser = fs.createReadStream(filePath).pipe(parse({
    columns: true,
    relax: true,
    skip_empty_lines: true,
    trim: true
  }));

  parser.on('error', (err) => {
    console.error('CSV parse error:', err);
    // cleanup
    try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
    return res.status(400).json({ error: 'Failed to parse CSV' });
  });

  parser.on('data', (row) => {
    // normalize and push
    try {
      const normalized = normalizeRow(row);
      // only include rows with required fields
      if (normalized.name && normalized.registerNumber) records.push(normalized);
    } catch (e) {
      // ignore this row but log
      console.warn('Skipping bad CSV row', e, row);
    }
  });

  parser.on('end', async () => {
    try {
      if (records.length === 0) {
        try { fs.unlinkSync(filePath); } catch (e) {}
        return res.status(400).json({ error: 'No valid rows found in CSV' });
      }

      // Optionally: deduplicate by registerNumber to avoid duplicates
      // Build a filter to remove students with same registerNumbers (if desired)
      // For now, we insert and rely on schema/unique index if you have it.
      const inserted = await Student.insertMany(records, { ordered: false });
      try { fs.unlinkSync(filePath); } catch (e) {}
      return res.json({ ok: true, inserted: inserted.length });
    } catch (err) {
      console.error('CSV insert error:', err);
      try { fs.unlinkSync(filePath); } catch (e) {}
      return res.status(500).json({ error: 'Failed to save students' });
    }
  });
});

module.exports = router;
