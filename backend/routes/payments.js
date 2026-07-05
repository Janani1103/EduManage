const express = require('express');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'student') {
      const s = await Student.findOne({ user: req.user._id });
      filter.student = s?._id;
    }
    const { status } = req.query;
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('class', 'name')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/pay', protect, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'paid', paidDate: new Date(), paymentMethod: req.body.paymentMethod, receiptNo: req.body.receiptNo },
      { new: true }
    );
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
