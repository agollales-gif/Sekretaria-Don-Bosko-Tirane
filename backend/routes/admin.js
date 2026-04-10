const router = require('express').Router();
const bcrypt = require('bcrypt');
const db     = require('../utils/supabase');
const { verifyToken, requireRole } = require('../middleware/auth');

// GET /api/admin/secretaries
router.get('/secretaries', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { data: secretaries } = await db
      .from('users')
      .select('id, username, role, email, phone, last_login, created_at')
      .neq('role', 'admin');

    const today = new Date(); today.setHours(0, 0, 0, 0);

    const result = await Promise.all(secretaries.map(async s => {
      const { count } = await db
        .from('message_logs')
        .select('*', { count: 'exact', head: true })
        .eq('secretary_id', s.id)
        .neq('action_type', 'korrigjim')
        .gte('timestamp', today.toISOString());
      return { ...s, message_count_today: count || 0 };
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

    const hash = await bcrypt.hash(newPassword, 10);
    const { error } = await db.from('users').update({ password_hash: hash }).eq('id', secretaryId);
    if (error) throw error;

    await db.from('activity_logs').insert({
      actor_id: req.user.userId, actor_role: 'admin',
      action_type: 'password_change',
      metadata: { target_id: secretaryId, changed_by: 'admin' },
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

    let query = db
      .from('activity_logs')
      .select('*, users(username, role)')
      .order('timestamp', { ascending: false })
      .limit(200);

    if (actorId)    query = query.eq('actor_id', actorId);
    if (actionType) query = query.eq('action_type', actionType);
    if (from)       query = query.gte('timestamp', from);
    if (to)         query = query.lte('timestamp', to);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
