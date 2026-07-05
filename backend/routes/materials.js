const express = require('express');
const path = require('path');
const multer = require('multer');
const Material = require('../models/Material');
const Teacher = require('../models/Teacher');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, process.env.UPLOAD_PATH || './uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', protect, async (req, res) => {
  try {
    const { class: classId } = req.query;
    const filter = classId ? { class: classId } : {};
    const materials = await Material.find(filter)
      .populate('class', 'name')
      .populate('subject', 'name')
      .sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'teacher'), upload.single('file'), async (req, res) => {
  try {
    let teacherId = req.body.teacher;
    if (req.user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: req.user._id });
      teacherId = teacher?._id;
    }
    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
    const fileType = ['pdf', 'ppt', 'pptx', 'doc', 'docx'].includes(ext)
      ? (ext === 'pptx' ? 'ppt' : ext === 'docx' ? 'doc' : ext)
      : 'other';

    const material = await Material.create({
      title: req.body.title,
      description: req.body.description,
      class: req.body.class,
      subject: req.body.subject,
      teacher: teacherId,
      fileType,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      uploadedBy: req.user._id,
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
