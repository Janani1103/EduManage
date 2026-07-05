const express = require('express');
const ClassModel = require('../models/Class');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const classes = await ClassModel.find()
      .populate('subject', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'students', populate: { path: 'user', select: 'name' } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id)
      .populate('subject', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'students', populate: { path: 'user', select: 'name email' } });
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const cls = await ClassModel.create(req.body);
    const populated = await ClassModel.findById(cls._id)
      .populate('subject', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } });
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const cls = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('subject', 'name code')
      .populate({ path: 'teacher', populate: { path: 'user', select: 'name' } });
    if (!cls) return res.status(404).json({ message: 'Class not found' });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await ClassModel.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Class deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Enroll student in class
router.post('/:id/enroll', protect, authorize('admin'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const cls = await ClassModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: studentId } },
      { new: true }
    );
    await Student.findByIdAndUpdate(studentId, { $addToSet: { enrolledClasses: req.params.id } });
    res.json(cls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
