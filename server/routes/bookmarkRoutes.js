const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookmarkController.addBookmark);
router.get('/', authMiddleware, bookmarkController.getBookmarks);
router.get('/check/:opportunityId', authMiddleware, bookmarkController.checkBookmark);
router.delete('/:id', authMiddleware, bookmarkController.removeBookmark);

module.exports = router;
