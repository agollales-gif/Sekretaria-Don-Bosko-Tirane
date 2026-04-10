const router   = require('express').Router();
const Template = require('../models/Template');
const ActivityLog = require('../models/ActivityLog');
const { verifyToken } = require('../middleware/auth');
const { DEFAULT_TEMPLATES } = require('../utils/generateMessage');

// GET /api/templates/:role  — returns all templates for the logged-in secretary
router.get('/', verifyToken, async (req, res) => {
  try {
    const saved = await Template.find({ secretaryId: req.user.userId });
    const result = {};
    Object.keys(DEFAULT_TEMPLATES).forEach(key => {
      const custom = saved.find(t => t.actionType === key);
      result[key] = custom ? custom.templateText : DEFAULT_TEMPLATES[key];
    });
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// PUT /api/templates  — save/update a template
router.put('/', verifyToken, async (req, res) => {
  try {
    const { actionType, templateText } = req.body;
    if (!actionType || !templateText)
      return res.status(400).json({ error: 'actionType dhe templateText janë të detyrueshëm.' });

    await Template.findOneAndUpdate(
      { secretaryId: req.user.userId, actionType },
      { templateText, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    await ActivityLog.create({
      actorId: req.user.userId, actorRole: req.user.role,
      actionType: 'template_edit', metadata: { actionType },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
