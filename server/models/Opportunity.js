const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Hackathon', 'Internship', 'Job'], required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  location: { type: String, required: true },
  deadline: { type: Date, required: true },
  applyLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
