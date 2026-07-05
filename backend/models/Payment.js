const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  amount: { type: Number, required: true },
  dueDate: { type: Date },
  paidDate: { type: Date },
  status: { type: String, enum: ['pending', 'paid', 'overdue', 'partial'], default: 'pending' },
  paymentMethod: { type: String },
  receiptNo: { type: String },
  month: { type: String },
  remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
