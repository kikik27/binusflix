const express = require('express');
const router = express.Router();
const {
  getExploreContent,
  getFeaturedBanners,
  getContentDetail,
} = require('../controllers/contentController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/explore', getExploreContent);
router.get('/featured', getFeaturedBanners);
router.get('/detail/:type/:id', optionalAuth, getContentDetail);

module.exports = router;
