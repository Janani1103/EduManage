require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Subject = require('./models/Subject');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@edumanage.com' });
  if (!adminExists) {
    await User.create({
      name: 'System Admin',
      email: 'admin@edumanage.com',
      password: 'admin123',
      role: 'admin',
      phone: '0771234567',
    });
    console.log('Admin user created: admin@edumanage.com / admin123');
  }

  const subjects = [
    { name: 'Mathematics', code: 'MATH101', description: 'Core mathematics', credits: 3 },
    { name: 'Science', code: 'SCI101', description: 'General science', credits: 3 },
    { name: 'English', code: 'ENG101', description: 'English language', credits: 2 },
    { name: 'ICT', code: 'ICT101', description: 'Information technology', credits: 2 },
  ];

  for (const s of subjects) {
    await Subject.findOneAndUpdate({ code: s.code }, s, { upsert: true });
  }
  console.log('Sample subjects seeded');

  await mongoose.disconnect();
  console.log('Seed completed');
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
