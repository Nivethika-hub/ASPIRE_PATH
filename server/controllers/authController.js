const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

exports.register = async (req, res) => {
  try {
    const { name, email, password, skills, interests, role } = req.body;

    if (role === 'admin') {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      return res.status(201).json({ message: 'Admin registration successful' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      skills: skills || [],
      interests: interests || []
    });

    await student.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        role: 'admin',
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          profilePic: admin.profilePic
        }
      });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      role: 'student',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        profilePic: student.profilePic,
        skills: student.skills,
        interests: student.interests
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const Model = req.user.role === 'admin' ? Admin : Student;
    const profile = await Model.findById(req.user.id).select('-password');
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, skills, interests, profilePic } = req.body;
    const Model = req.user.role === 'admin' ? Admin : Student;
    const profile = await Model.findByIdAndUpdate(
      req.user.id,
      { name, skills, interests, profilePic },
      { new: true }
    ).select('-password');

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
