const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);
