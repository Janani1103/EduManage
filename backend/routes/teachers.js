const express = require('express');
const Teacher = require('../models/Teacher');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', 'name email phone isActive')
      .populate('subjects', 'name code');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('subjects', 'name code');
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, phone, qualification, specialization, subjects, salary } = req.body;
    const user = await User.create({ name, email, password, role: 'teacher', phone });
    const count = await Teacher.countDocuments();
    const teacher = await Teacher.create({
      user: user._id,
      employeeId: `TCH${String(count + 1).padStart(4, '0')}`,
      qualification,
      specialization,
      subjects,
      salary,
    });
    const populated = await Teacher.findById(teacher._id).populate('user', 'name email phone');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const { name, email, phone, qualification, specialization, subjects, salary, bio } = req.body;
    if (name || email || phone) {
      await User.findByIdAndUpdate(teacher.user, { name, email, phone }, { new: true });
    }
    const updated = await Teacher.findByIdAndUpdate(
      req.params.id,
      { qualification, specialization, subjects, salary, bio },
      { new: true }
    ).populate('user', 'name email phone').populate('subjects', 'name code');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    await User.findByIdAndUpdate(teacher.user, { isActive: false });
    res.json({ message: 'Teacher deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
