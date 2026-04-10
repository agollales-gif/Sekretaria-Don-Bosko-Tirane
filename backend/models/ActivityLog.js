const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  actorId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actorRole:  { type: String, required: true },
  actionType: {
    type: String,
    enum: ['login', 'logout', 'message_sent', 'correction_sent', 'password_change', 'template_edit'],
    required: true,
  },
  metadata:  { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
