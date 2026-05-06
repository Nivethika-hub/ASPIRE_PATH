const Opportunity = require('../models/Opportunity');
const Student = require('../models/Student');

exports.createOpportunity = async (req, res) => {
  try {
    const opportunity = new Opportunity(req.body);
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllOpportunities = async (req, res) => {
  try {
    const { type, location, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');
    if (search) query.title = new RegExp(search, 'i');

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteOpportunity = async (req, res) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const opportunities = await Opportunity.find();

    const recommendations = opportunities.map(opp => {
      const matchingSkills = opp.skillsRequired.filter(skill =>
        student.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
      const matchScore = opp.skillsRequired.length > 0
        ? Math.round((matchingSkills.length / opp.skillsRequired.length) * 100)
        : 0;

      return { ...opp.toObject(), matchScore };
    }).filter(opp => opp.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalOpportunities = await Opportunity.countDocuments();
    const activeOpportunities = await Opportunity.countDocuments({ deadline: { $gte: new Date() } });
    const expiredOpportunities = await Opportunity.countDocuments({ deadline: { $lt: new Date() } });
    const totalStudents = await Student.countDocuments();

    res.json({
      totalOpportunities,
      activeOpportunities,
      expiredOpportunities,
      totalStudents
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
