require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Opportunity = require('./models/Opportunity');
const Admin = require('./models/Admin');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  await Student.deleteMany({});
  await Opportunity.deleteMany({});
  await Admin.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await Admin.create({
    email: 'admin@aspirepath.com',
    password: await bcrypt.hash('admin123', 10)
  });

  const students = await Student.insertMany([
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      skills: ['JavaScript', 'React', 'Node.js'],
      interests: ['Web Development', 'AI']
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      skills: ['Python', 'Machine Learning', 'Data Science'],
      interests: ['AI', 'Data Analytics']
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: hashedPassword,
      skills: ['Java', 'Spring Boot', 'MySQL'],
      interests: ['Backend Development', 'Cloud Computing']
    }
  ]);

  const opportunities = await Opportunity.insertMany([
    {
      title: 'Smart India Hackathon 2024',
      type: 'Hackathon',
      company: 'Government of India',
      description: 'National level hackathon for innovative solutions',
      skillsRequired: ['JavaScript', 'React', 'Node.js'],
      location: 'Online',
      deadline: new Date('2024-12-31'),
      applyLink: 'https://sih.gov.in'
    },
    {
      title: 'Google Summer Internship',
      type: 'Internship',
      company: 'Google',
      description: 'Software engineering internship at Google',
      skillsRequired: ['Python', 'Java', 'Algorithms'],
      location: 'Bangalore',
      deadline: new Date('2024-11-30'),
      applyLink: 'https://careers.google.com'
    },
    {
      title: 'Full Stack Developer',
      type: 'Job',
      company: 'Amazon',
      description: 'Full-time position for experienced developers',
      skillsRequired: ['JavaScript', 'React', 'AWS'],
      location: 'Hyderabad',
      deadline: new Date('2024-10-15'),
      applyLink: 'https://amazon.jobs'
    },
    {
      title: 'AI/ML Hackathon',
      type: 'Hackathon',
      company: 'Microsoft',
      description: 'Build AI solutions for real-world problems',
      skillsRequired: ['Python', 'Machine Learning', 'TensorFlow'],
      location: 'Mumbai',
      deadline: new Date('2024-09-20'),
      applyLink: 'https://microsoft.com/hackathon'
    },
    {
      title: 'Data Science Internship',
      type: 'Internship',
      company: 'Flipkart',
      description: 'Work on data analytics and ML projects',
      skillsRequired: ['Python', 'Data Science', 'SQL'],
      location: 'Bangalore',
      deadline: new Date('2024-12-01'),
      applyLink: 'https://flipkart.com/careers'
    },
    {
      title: 'Backend Developer',
      type: 'Job',
      company: 'Infosys',
      description: 'Java backend developer position',
      skillsRequired: ['Java', 'Spring Boot', 'MySQL'],
      location: 'Pune',
      deadline: new Date('2024-11-15'),
      applyLink: 'https://infosys.com/careers'
    }
  ]);

  console.log('Dummy data inserted successfully!');
  console.log('\nStudent Credentials:');
  console.log('Email: john@example.com | Password: password123');
  console.log('Email: jane@example.com | Password: password123');
  console.log('Email: mike@example.com | Password: password123');
  console.log('\nAdmin Credentials:');
  console.log('Email: admin@aspirepath.com | Password: admin123');
  
  process.exit(0);
};

seedData();
