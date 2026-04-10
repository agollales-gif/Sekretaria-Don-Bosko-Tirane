const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['sec_9vjecare', 'sec_gjimnaz', 'admin'], required: true },
  email:        { type: String, default: 'qfp_donbosko@yahoo.it' },
  phone:        { type: String, default: '+355 69 405 4009' },
  lastLogin:    { type: Date, default: null },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
