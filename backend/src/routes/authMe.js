const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth'); // uses your existing auth middleware
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    // auth middleware attaches the JWT payload to `req.user`.
    // The payload commonly contains `userId` (or sometimes `id`/_id),
    // but could also be a full user object in some setups. Normalize that here.
    let userId = null;
    if (req.user) {
      if (typeof req.user === 'string') userId = req.user;
      else if (typeof req.user === 'object') {
        userId = req.user.userId || req.user.id || req.user._id || null;
      }
    }

    // If req.user is already a full user object with identifiable fields, return it safely
    if (req.user && typeof req.user === 'object' && req.user.email) {
      const safeUser = { ...req.user };
      delete safeUser.password;
      delete safeUser.passwordHash;
      return res.json({ user: safeUser });
    }

    // otherwise load from DB if we have an id
    if (!userId) return res.json({ user: null });

    const user = await User.findById(userId).select('-password -passwordHash -__v').lean();
    return res.json({ user });
  } catch (err) {
    console.error('GET /auth/me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
