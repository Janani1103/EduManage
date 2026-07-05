const express = require('express');
const Submission = require('../models/Submission');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { assignment } = req.query;
    const filter = assignment ? { assignment } : {};
    const submissions = await Submission.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('assignment', 'title dueDate maxMarks');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const submission = await Submission.create({
      ...req.body,
      student: student._id,
      status: 'submitted',
    });
    const populated = await Submission.findById(submission._id)
      .populate('assignment', 'title')
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already submitted' });
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/grade', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { marks, feedback, status: 'graded' },
      { new: true }
    ).populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
