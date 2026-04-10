const router      = require('express').Router();
const bcrypt      = require('bcrypt');
const User        = require('../models/User');
const MessageLog  = require('../models/MessageLog');
const ActivityLog = require('../models/ActivityLog');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/admin/secretaries
router.get('/secretaries', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const secretaries = await User.find({ role: { $ne: 'admin' } }).select('-passwordHash');

    // Add today's message count for each
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const result = await Promise.all(secretaries.map(async s => {
      const count = await MessageLog.countDocuments({
        secretaryId: s._id,
        timestamp: { $gte: today },
        actionType: { $ne: 'korrigjim' },
      });
      return { ...s.toObject(), messageCountToday: count };
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// PUT /api/admin/reset-password
router.put('/reset-password', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { secretaryId, newPassword } = req.body;
    if (!secretaryId || !newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Të dhëna të pavlefshme.' });

    const user = await User.findById(secretaryId);
    if (!user) return res.status(404).json({ error: 'Sekretaria nuk u gjet.' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await ActivityLog.create({
      actorId: req.user.userId, actorRole: 'admin',
      actionType: 'password_change',
      metadata: { targetId: secretaryId, changedBy: 'admin' },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// GET /api/admin/activity-feed
router.get('/activity-feed', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { actorId, actionType, from, to } = req.query;
    const filter = {};
    if (actorId)    filter.actorId    = actorId;
    if (actionType) filter.actionType = actionType;
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to)   filter.timestamp.$lte = new Date(to);
    }

    const feed = await ActivityLog.find(filter)
      .populate('actorId', 'username role')
      .sort({ timestamp: -1 })
      .limit(200);

    res.json(feed);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
