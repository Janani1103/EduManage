const express = require('express');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const ClassModel = require('../models/Class');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Result = require('../models/Result');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [totalStudents, totalTeachers, activeClasses, monthlyAttendance, pendingFees] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      ClassModel.countDocuments({ isActive: true }),
      Attendance.countDocuments({ date: { $gte: startOfMonth, $lte: endOfMonth }, status: 'present' }),
      Payment.countDocuments({ status: { $in: ['pending', 'overdue'] } }),
    ]);

    const totalIncome = await Payment.aggregate([
      { $match: { status: 'paid', paidDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const attendanceStats = await Attendance.aggregate([
      { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const performanceData = await Result.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$grade', count: { $sum: 1 } } },
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      activeClasses,
      monthlyAttendance,
      pendingFees,
      monthlyIncome: totalIncome[0]?.total || 0,
      attendanceStats,
      performanceData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/teacher-workload', protect, authorize('admin'), async (req, res) => {
  try {
    const workload = await ClassModel.aggregate([
      { $match: { isActive: true, teacher: { $ne: null } } },
      { $group: { _id: '$teacher', classCount: { $sum: 1 }, totalStudents: { $sum: { $size: '$students' } } } },
      { $lookup: { from: 'teachers', localField: '_id', foreignField: '_id', as: 'teacher' } },
      { $unwind: '$teacher' },
      { $lookup: { from: 'users', localField: 'teacher.user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', classCount: 1, totalStudents: 1 } },
    ]);
    res.json(workload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
