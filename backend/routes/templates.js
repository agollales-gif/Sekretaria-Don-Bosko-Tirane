const router = require('express').Router();
const db     = require('../utils/supabase');
const { verifyToken } = require('../middleware/auth');
const { DEFAULT_TEMPLATES } = require('../utils/generateMessage');

// GET /api/templates
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: saved } = await db
      .from('templates')
      .select('*')
      .eq('secretary_id', req.user.userId);

    const result = {};
    Object.keys(DEFAULT_TEMPLATES).forEach(key => {
      const custom = saved?.find(t => t.action_type === key);
      result[key] = custom ? custom.template_text : DEFAULT_TEMPLATES[key];
    });
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// PUT /api/templates
router.put('/', verifyToken, async (req, res) => {
  try {
    const { actionType, templateText } = req.body;
    if (!actionType || !templateText)
      return res.status(400).json({ error: 'actionType dhe templateText janë të detyrueshëm.' });

    await db.from('templates').upsert({
      secretary_id: req.user.userId,
      action_type: actionType,
      template_text: templateText,
      updated_at: new Date(),
    }, { onConflict: 'secretary_id,action_type' });

    await db.from('activity_logs').insert({
      actor_id: req.user.userId, actor_role: req.user.role,
      action_type: 'template_edit', metadata: { action_type: actionType },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
