const express = require('express');
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { class: classId, student, date, status, remarks } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { class: classId, student, date: new Date(date) },
      { status, remarks, markedBy: req.user._id },
      { upsert: true, new: true }
    );
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/bulk', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { class: classId, date, records } = req.body;
    const results = [];
    for (const rec of records) {
      const att = await Attendance.findOneAndUpdate(
        { class: classId, student: rec.student, date: new Date(date) },
        { status: rec.status, remarks: rec.remarks, markedBy: req.user._id },
        { upsert: true, new: true }
      );
      results.push(att);
    }
    res.status(201).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/class/:id', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { class: req.params.id };
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: new Date(d.setHours(0, 0, 0, 0)), $lte: new Date(d.setHours(23, 59, 59, 999)) };
    }
    const attendance = await Attendance.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/:id', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { student: req.params.id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    const attendance = await Attendance.find(filter)
      .populate('class', 'name')
      .sort('-date');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
