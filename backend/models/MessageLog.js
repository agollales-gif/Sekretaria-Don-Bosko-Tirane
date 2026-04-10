const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema({
  studentId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  secretaryId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType:     {
    type: String,
    enum: ['vone_ora1', 'vone_ora2', 'takim_mesues', 'takim_drejtori', 'semurje', 'korrigjim'],
    required: true,
  },
  messageText:    { type: String, required: true },
  parentPhone:    { type: String, required: true },
  status:         { type: String, enum: ['sent', 'failed', 'pending'], default: 'pending' },
  isCorrectionOf: { type: mongoose.Schema.Types.ObjectId, ref: 'MessageLog', default: null },
  timestamp:      { type: Date, default: Date.now },
});

module.exports = mongoose.model('MessageLog', messageLogSchema);
