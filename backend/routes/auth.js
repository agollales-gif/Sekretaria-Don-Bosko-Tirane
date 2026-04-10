const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const db      = require('../utils/supabase');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username dhe fjalëkalimi janë të detyrueshëm.' });

    const { data: user, error } = await db
      .from('users')
      .select('*')
      .eq('username', username.trim().toLowerCase())
      .single();

    if (error || !user) return res.status(401).json({ error: 'Kredencialet janë të gabuara.' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Kredencialet janë të gabuara.' });

    const token = jwt.sign(
      { userId: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    await db.from('users').update({ last_login: new Date() }).eq('id', user.id);
    await db.from('activity_logs').insert({ actor_id: user.id, actor_role: user.role, action_type: 'login', metadata: {} });

    res.json({ token, role: user.role, username: user.username, expiresAt: Date.now() + 8 * 3600 * 1000 });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// POST /api/auth/logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    await db.from('activity_logs').insert({ actor_id: req.user.userId, actor_role: req.user.role, action_type: 'logout', metadata: {} });
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

    const { data: user } = await db.from('users').select('*').eq('id', req.user.userId).single();
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Fjalëkalimi aktual është i gabuar.' });

    const hash = await bcrypt.hash(newPassword, 10);
    await db.from('users').update({ password_hash: hash }).eq('id', user.id);
    await db.from('activity_logs').insert({ actor_id: user.id, actor_role: user.role, action_type: 'password_change', metadata: { changed_by: 'self' } });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
