const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All favorite routes require authentication

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:contentId', removeFavorite);
router.get('/check/:contentId', checkFavorite);

module.exports = router;
