const express = require('express');
const router = express.Router();
const {
  getReviewsByContent,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:contentId', getReviewsByContent);
router.post('/:contentId', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
