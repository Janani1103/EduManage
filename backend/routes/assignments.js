const express = require('express');
const Assignment = require('../models/Assignment');
const Teacher = require('../models/Teacher');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const { class: classId } = req.query;
    const filter = classId ? { class: classId } : {};
    const assignments = await Assignment.find(filter)
      .populate('class', 'name')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } })
      .sort('-createdAt');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    let teacherId = req.body.teacher;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user._id });
      teacherId = teacher?._id;
    }
    const assignment = await Assignment.create({ ...req.body, teacher: teacherId });
    const populated = await Assignment.findById(assignment._id)
      .populate('class', 'name')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } });
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('class', 'name');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
