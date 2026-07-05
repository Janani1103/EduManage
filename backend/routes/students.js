const express = require('express');
const Student = require('../models/Student');
const User = require('../models/User');
const ClassModel = require('../models/Class');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email phone isActive')
      .populate({
        path: 'enrolledClasses',
        select: 'name subject',
        populate: { path: 'subject', select: 'name' }
      });

    const result = students.map(s => {
      const obj = s.toObject();
      obj.classCount = Array.isArray(obj.enrolledClasses) ? obj.enrolledClasses.length : 0;
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({
        path: 'enrolledClasses',
        select: 'name subject',
        populate: { path: 'subject', select: 'name' }
      });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, phone, grade, parentName, parentPhone, address, enrolledClasses } = req.body;
    const user = await User.create({ name, email, password, role: 'student', phone });
    const count = await Student.countDocuments();
    const student = await Student.create({
      user: user._id,
      studentId: `STU${String(count + 1).padStart(4, '0')}`,
      grade,
      parentName,
      parentPhone,
      address,
      enrolledClasses: enrolledClasses || [],
    });

    if (enrolledClasses && enrolledClasses.length > 0) {
      await ClassModel.updateMany(
        { _id: { $in: enrolledClasses } },
        { $addToSet: { students: student._id } }
      );
    }

    const populated = await Student.findById(student._id)
      .populate('user', 'name email phone')
      .populate({
        path: 'enrolledClasses',
        select: 'name subject',
        populate: { path: 'subject', select: 'name' }
      });
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const { name, email, phone, grade, parentName, parentPhone, address, enrolledClasses } = req.body;
    if (name || email || phone) {
      await User.findByIdAndUpdate(student.user, { name, email, phone }, { new: true });
    }
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { grade, parentName, parentPhone, address, enrolledClasses: enrolledClasses || [] },
      { new: true }
    ).populate('user', 'name email phone')
     .populate({
        path: 'enrolledClasses',
        select: 'name subject',
        populate: { path: 'subject', select: 'name' }
     });

    if (enrolledClasses) {
      // Remove student from any class they are no longer enrolled in
      await ClassModel.updateMany(
        { _id: { $nin: enrolledClasses }, students: student._id },
        { $pull: { students: student._id } }
      );
      // Add student to new classes
      await ClassModel.updateMany(
        { _id: { $in: enrolledClasses } },
        { $addToSet: { students: student._id } }
      );
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await User.findByIdAndUpdate(student.user, { isActive: false });
    res.json({ message: 'Student deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
