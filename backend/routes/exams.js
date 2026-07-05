const express = require('express');
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { class: classId } = req.query;
    const filter = classId ? { class: classId } : {};
    const exams = await Exam.find(filter)
      .populate('class', 'name')
      .populate('subject', 'name code')
      .sort('-examDate');
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/publish', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { isPublished: true }, { new: true });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
