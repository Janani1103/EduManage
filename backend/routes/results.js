const express = require('express');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { exam, student } = req.query;
    const filter = {};
    if (exam) filter.exam = exam;
    if (student) filter.student = student;
    if (req.user.role === 'student') {
      const s = await Student.findOne({ user: req.user._id });
      filter.student = s?._id;
      filter.isPublished = true;
    }
    const results = await Result.find(filter)
      .populate('exam', 'title examDate maxMarks')
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { exam, student, marks, grade, remarks } = req.body;
    const result = await Result.findOneAndUpdate(
      { exam, student },
      { marks, grade, remarks },
      { upsert: true, new: true }
    );
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/bulk', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const { exam, results } = req.body;
    const saved = [];
    for (const r of results) {
      const result = await Result.findOneAndUpdate(
        { exam, student: r.student },
        { marks: r.marks, grade: r.grade, remarks: r.remarks },
        { upsert: true, new: true }
      );
      saved.push(result);
    }
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/publish/:examId', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    await Result.updateMany({ exam: req.params.examId }, { isPublished: true });
    res.json({ message: 'Results published' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
