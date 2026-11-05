const Review = require('../models/Review');

// @desc Get reviews for specific content
// @route GET /api/reviews/:contentId
const getReviewsByContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const reviews = await Review.find({ contentId }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

    res.json({
      success: true,
      count: totalReviews,
      averageRating: parseFloat(averageRating),
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal memuat ulasan' });
  }
};

// @desc Add a review & rating
// @route POST /api/reviews/:contentId
const createReview = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentType, contentTitle, rating, reviewText } = req.body;

    if (!rating || !reviewText) {
      return res.status(400).json({ message: 'Rating dan ulasan wajib diisi' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating harus antara 1 sampai 5 bintang' });
    }

    const review = await Review.create({
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar,
      contentId,
      contentType: contentType || 'movie',
      contentTitle: contentTitle || '',
      rating: Number(rating),
      reviewText: reviewText.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Ulasan Anda berhasil dikirim',
      data: review,
    });
  } catch (error) {
    console.error('[Create Review Error]', error);
    res.status(500).json({ message: error.message || 'Gagal mengirim ulasan' });
  }
};

// @desc Delete review (author only)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Ulasan tidak ditemukan' });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin menghapus ulasan ini' });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Ulasan berhasil dihapus',
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal menghapus ulasan' });
  }
};

module.exports = {
  getReviewsByContent,
  createReview,
  deleteReview,
};
