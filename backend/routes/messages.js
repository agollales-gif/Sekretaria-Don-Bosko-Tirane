const router      = require('express').Router();
const Student     = require('../models/Student');
const MessageLog  = require('../models/MessageLog');
const ActivityLog = require('../models/ActivityLog');
const { verifyToken } = require('../middleware/auth');
const { generateMessage } = require('../utils/generateMessage');
const { sendWhatsAppMessage, getStatus } = require('../utils/whatsapp');
const { format } = require('date-fns');

// POST /api/messages/send
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { studentId, actionType, customTime } = req.body;
    if (!studentId || !actionType)
      return res.status(400).json({ error: 'studentId dhe actionType janë të detyrueshëm.' });

    const student = await Student.findById(studentId).populate('classId');
    if (!student) return res.status(404).json({ error: 'Nxënësi nuk u gjet.' });

    const now  = new Date();
    const time = customTime || format(now, 'HH:mm');
    const date = format(now, 'dd/MM/yyyy');
    const name = `${student.firstName} ${student.lastName}`;

    const text = await generateMessage(req.user.userId, actionType, name, time, date);

    const log = await MessageLog.create({
      studentId:   student._id,
      secretaryId: req.user.userId,
      actionType,
      messageText: text,
      parentPhone: student.parentPhone,
      status:      'pending',
    });

    // Send via WhatsApp
    try {
      await sendWhatsAppMessage(student.parentPhone, text);
      log.status = 'sent';
    } catch (waErr) {
      log.status = 'failed';
      await log.save();
      return res.status(503).json({ success: false, error: waErr.message, logId: log._id });
    }

    await log.save();

    await ActivityLog.create({
      actorId: req.user.userId, actorRole: req.user.role,
      actionType: 'message_sent',
      metadata: { studentName: name, class: student.classId?.name, actionType },
    });

    res.json({ success: true, logId: log._id });
  } catch (err) {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// POST /api/messages/correction
router.post('/correction', verifyToken, async (req, res) => {
  try {
    const { originalLogId } = req.body;
    if (!originalLogId) return res.status(400).json({ error: 'originalLogId mungon.' });

    const original = await MessageLog.findById(originalLogId).populate('studentId');
    if (!original) return res.status(404).json({ error: 'Mesazhi origjinal nuk u gjet.' });

    const student = original.studentId;
    const name    = `${student.firstName} ${student.lastName}`;
    const now     = new Date();
    const time    = format(now, 'HH:mm');
    const date    = format(now, 'dd/MM/yyyy');

    const text = await generateMessage(req.user.userId, 'korrigjim', name, time, date);

    const log = await MessageLog.create({
      studentId:      student._id,
      secretaryId:    req.user.userId,
      actionType:     'korrigjim',
      messageText:    text,
      parentPhone:    student.parentPhone,
      status:         'pending',
      isCorrectionOf: original._id,
    });

    try {
      await sendWhatsAppMessage(student.parentPhone, text);
      log.status = 'sent';
    } catch (waErr) {
      log.status = 'failed';
      await log.save();
      return res.status(503).json({ success: false, error: waErr.message });
    }

    await log.save();

    await ActivityLog.create({
      actorId: req.user.userId, actorRole: req.user.role,
      actionType: 'correction_sent',
      metadata: { studentName: name, originalLogId },
    });

    res.json({ success: true, logId: log._id });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// GET /api/messages/history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { secretaryId: req.user.userId };
    if (from || to) {
      filter.timestamp = {};
      if (from) filter.timestamp.$gte = new Date(from);
      if (to)   filter.timestamp.$lte = new Date(to);
    }

    const logs = await MessageLog.find(filter)
      .populate({ path: 'studentId', select: 'firstName lastName', populate: { path: 'classId', select: 'name' } })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
