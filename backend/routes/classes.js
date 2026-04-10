const router  = require('express').Router();
const Class   = require('../models/Class');
const Student = require('../models/Student');
const { verifyToken } = require('../middleware/auth');

// GET /api/classes
router.get('/', verifyToken, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'sec_9vjecare') filter = { gradeLevel: { $lte: 9 } };
    if (req.user.role === 'sec_gjimnaz')  filter = { gradeLevel: { $gte: 10 } };
    const classes = await Class.find(filter).sort({ name: 1 });
    res.json(classes);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// GET /api/classes/:id/students
router.get('/:id/students', verifyToken, async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ error: 'Klasa nuk u gjet.' });

    // Role check
    if (req.user.role === 'sec_9vjecare' && cls.gradeLevel > 9)
      return res.status(403).json({ error: 'Akses i ndaluar.' });
    if (req.user.role === 'sec_gjimnaz' && cls.gradeLevel < 10)
      return res.status(403).json({ error: 'Akses i ndaluar.' });

    const students = await Student.find({ classId: req.params.id })
      .select('firstName lastName parentPhone parentName')
      .sort({ lastName: 1 });

    res.json(students);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
