const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name:       { type: String, required: true, unique: true }, // e.g. "9A"
  gradeLevel: { type: Number, required: true, min: 1, max: 12 },
  section:    { type: String, enum: ['9vjecare', 'gjimnaz'], required: true },
});

module.exports = mongoose.model('Class', classSchema);
