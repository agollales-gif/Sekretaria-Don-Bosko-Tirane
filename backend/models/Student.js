const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  classId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  parentPhone: { type: String, required: true }, // format: +355xxxxxxxx
  parentName:  { type: String, default: '' },
});

studentSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Student', studentSchema);
