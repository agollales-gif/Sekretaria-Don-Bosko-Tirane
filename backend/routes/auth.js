const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username dhe fjalëkalimi janë të detyrueshëm.' });

    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Kredencialet janë të gabuara.' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Kredencialet janë të gabuara.' });

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    user.lastLogin = new Date();
    await user.save();

    await ActivityLog.create({ actorId: user._id, actorRole: user.role, actionType: 'login', metadata: {} });

    res.json({ token, role: user.role, username: user.username, expiresAt: Date.now() + 8 * 3600 * 1000 });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// POST /api/auth/logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    await ActivityLog.create({ actorId: req.user.userId, actorRole: req.user.role, actionType: 'logout', metadata: {} });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Të dhëna të pavlefshme.' });

    const user = await User.findById(req.user.userId);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Fjalëkalimi aktual është i gabuar.' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await ActivityLog.create({
      actorId: user._id, actorRole: user.role,
      actionType: 'password_change', metadata: { changedBy: 'self' }
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
