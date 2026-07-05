const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employeeId: { type: String, unique: true },
  qualification: { type: String },
  specialization: { type: String },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
  joinDate: { type: Date, default: Date.now },
  salary: { type: Number },
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
