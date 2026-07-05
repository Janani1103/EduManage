const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  marks: { type: Number, required: true },
  grade: { type: String },
  remarks: { type: String },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

resultSchema.index({ exam: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
