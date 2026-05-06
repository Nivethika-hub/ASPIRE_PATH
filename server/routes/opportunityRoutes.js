const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, opportunityController.createOpportunity);
router.get('/', opportunityController.getAllOpportunities);
router.get('/stats', authMiddleware, opportunityController.getStats);
router.get('/recommendations', authMiddleware, opportunityController.getRecommendations);
router.get('/:id', opportunityController.getOpportunityById);
router.put('/:id', authMiddleware, opportunityController.updateOpportunity);
router.delete('/:id', authMiddleware, opportunityController.deleteOpportunity);

module.exports = router;
