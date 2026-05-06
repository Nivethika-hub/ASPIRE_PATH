const Bookmark = require('../models/Bookmark');

exports.addBookmark = async (req, res) => {
  try {
    const { opportunityId } = req.body;
    const studentId = req.user.id;

    const existing = await Bookmark.findOne({ studentId, opportunityId });
    if (existing) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    const bookmark = new Bookmark({ studentId, opportunityId });
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ studentId: req.user.id })
      .populate('opportunityId')
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    await Bookmark.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      studentId: req.user.id,
      opportunityId: req.params.opportunityId
    });
    res.json({ bookmarked: !!bookmark, bookmarkId: bookmark?._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
