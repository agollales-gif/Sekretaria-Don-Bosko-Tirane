const router = require('express').Router();
const db     = require('../utils/supabase');
const { verifyToken } = require('../middleware/auth');
const { generateMessage } = require('../utils/generateMessage');
const { sendWhatsAppMessage } = require('../utils/whatsapp');

function nowFormatted() {
  const d = new Date();
  const time = d.toTimeString().slice(0, 5);
  const date = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  return { time, date };
}

// POST /api/messages/send
router.post('/send', verifyToken, async (req, res) => {
  try {
    const { studentId, actionType, customTime } = req.body;
    if (!studentId || !actionType)
      return res.status(400).json({ error: 'studentId dhe actionType janë të detyrueshëm.' });

    const { data: student } = await db
      .from('students')
      .select('*, classes(name)')
      .eq('id', studentId)
      .single();
    if (!student) return res.status(404).json({ error: 'Nxënësi nuk u gjet.' });

    const { time, date } = nowFormatted();
    const name = `${student.first_name} ${student.last_name}`;
    const text = await generateMessage(req.user.userId, actionType, name, customTime || time, date);

    // Insert log as pending
    const { data: log } = await db.from('message_logs').insert({
      student_id: student.id, secretary_id: req.user.userId,
      action_type: actionType, message_text: text,
      parent_phone: student.parent_phone, status: 'pending',
    }).select().single();

    // Send via WhatsApp
    try {
      await sendWhatsAppMessage(student.parent_phone, text);
      await db.from('message_logs').update({ status: 'sent' }).eq('id', log.id);
    } catch (waErr) {
      await db.from('message_logs').update({ status: 'failed' }).eq('id', log.id);
      return res.status(503).json({ success: false, error: waErr.message, logId: log.id });
    }

    await db.from('activity_logs').insert({
      actor_id: req.user.userId, actor_role: req.user.role,
      action_type: 'message_sent',
      metadata: { student_name: name, class: student.classes?.name, action_type: actionType },
    });

    res.json({ success: true, logId: log.id });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// POST /api/messages/correction
router.post('/correction', verifyToken, async (req, res) => {
  try {
    const { originalLogId } = req.body;
    if (!originalLogId) return res.status(400).json({ error: 'originalLogId mungon.' });

    const { data: original } = await db
      .from('message_logs')
      .select('*, students(first_name, last_name, parent_phone)')
      .eq('id', originalLogId)
      .single();
    if (!original) return res.status(404).json({ error: 'Mesazhi origjinal nuk u gjet.' });

    const { time, date } = nowFormatted();
    const name = `${original.students.first_name} ${original.students.last_name}`;
    const text = await generateMessage(req.user.userId, 'korrigjim', name, time, date);

    const { data: log } = await db.from('message_logs').insert({
      student_id: original.student_id, secretary_id: req.user.userId,
      action_type: 'korrigjim', message_text: text,
      parent_phone: original.students.parent_phone,
      status: 'pending', is_correction_of: original.id,
    }).select().single();

    try {
      await sendWhatsAppMessage(original.students.parent_phone, text);
      await db.from('message_logs').update({ status: 'sent' }).eq('id', log.id);
    } catch (waErr) {
      await db.from('message_logs').update({ status: 'failed' }).eq('id', log.id);
      return res.status(503).json({ success: false, error: waErr.message });
    }

    await db.from('activity_logs').insert({
      actor_id: req.user.userId, actor_role: req.user.role,
      action_type: 'correction_sent',
      metadata: { student_name: name, original_log_id: originalLogId },
    });

    res.json({ success: true, logId: log.id });
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

// GET /api/messages/history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { from, to } = req.query;
    let query = db
      .from('message_logs')
      .select('*, students(first_name, last_name, classes(name))')
      .eq('secretary_id', req.user.userId)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (from) query = query.gte('timestamp', from);
    if (to)   query = query.lte('timestamp', to);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Gabim serveri.' });
  }
});

module.exports = router;
