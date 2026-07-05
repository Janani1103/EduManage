const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role: role || 'student', phone });

    if (user.role === 'student') {
      const count = await Student.countDocuments();
      await Student.create({ user: user._id, studentId: `STU${String(count + 1).padStart(4, '0')}` });
    } else if (user.role === 'teacher') {
      const count = await Teacher.countDocuments();
      await Teacher.create({ user: user._id, employeeId: `TCH${String(count + 1).padStart(4, '0')}` });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    let profile = null;
    if (user.role === 'student') profile = await Student.findOne({ user: user._id });
    if (user.role === 'teacher') profile = await Teacher.findOne({ user: user._id });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileId: profile?._id,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  let profile = null;
  if (req.user.role === 'student') profile = await Student.findOne({ user: req.user._id });
  if (req.user.role === 'teacher') profile = await Teacher.findOne({ user: req.user._id });
  res.json({ ...req.user.toObject(), profileId: profile?._id });
});

module.exports = router;
