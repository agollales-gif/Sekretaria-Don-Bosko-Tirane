const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  secretaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actionType:  {
    type: String,
    enum: ['vone_ora1', 'vone_ora2', 'takim_mesues', 'takim_drejtori', 'semurje'],
    required: true,
  },
  templateText: { type: String, required: true },
  updatedAt:    { type: Date, default: Date.now },
});

// One template per secretary+actionType combo
templateSchema.index({ secretaryId: 1, actionType: 1 }, { unique: true });

module.exports = mongoose.model('Template', templateSchema);
