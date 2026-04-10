const router = require('express').Router();
const db     = require('../utils/supabase');
const { verifyToken } = require('../middleware/auth');

// GET /api/classes
router.get('/', verifyToken, async (req, res) => {
  try {
    let query = db.from('classes').select('*').order('name');

    if (req.user.role === 'sec_9vjecare') query = query.lte('grade_level', 9);
    if (req.user.role === 'sec_gjimnaz')  query = query.gte('grade_level', 10);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// GET /api/classes/:id/students
router.get('/:id/students', verifyToken, async (req, res) => {
  try {
    const { data: cls, error: clsErr } = await db
      .from('classes').select('*').eq('id', req.params.id).single();
    if (clsErr || !cls) return res.status(404).json({ error: 'Klasa nuk u gjet.' });

    if (req.user.role === 'sec_9vjecare' && cls.grade_level > 9)
      return res.status(403).json({ error: 'Akses i ndaluar.' });
    if (req.user.role === 'sec_gjimnaz' && cls.grade_level < 10)
      return res.status(403).json({ error: 'Akses i ndaluar.' });

    const { data, error } = await db
      .from('students')
      .select('id, first_name, last_name, parent_phone, parent_name')
      .eq('class_id', req.params.id)
      .order('last_name');

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
