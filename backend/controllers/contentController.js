const entertainmentService = require('../services/entertainmentService');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');
const Content = require('../models/Content');

// @desc Get explore items (movies, tv, music)
// @route GET /api/content/explore
const getExploreContent = async (req, res) => {
  try {
    const { type = 'all', search = '', limit = 40 } = req.query;

    // Check if searching or if type is specified
    let items = [];
    if (!search || search.trim().length === 0) {
      // Query MongoDB Atlas Content collection
      const filter = {};
      if (type !== 'all') {
        filter.contentType = type;
      }
      const dbContents = await Content.find(filter).limit(parseInt(limit, 10) || 40);
      if (dbContents && dbContents.length > 0) {
        items = dbContents.map((doc) => ({
          id: doc.contentId,
          contentType: doc.contentType,
          title: doc.title,
          subtitle: doc.subtitle,
          overview: doc.overview,
          posterUrl: doc.posterUrl,
          backdropUrl: doc.backdropUrl,
          releaseDate: doc.releaseDate,
          rating: doc.rating,
          voteCount: doc.voteCount,
          genre: doc.genre,
          durationOrAlbum: doc.durationOrAlbum,
          trailerUrl: doc.trailerUrl,
          trailerKey: doc.trailerKey,
          previewUrl: doc.previewUrl,
          cast: doc.cast,
          featured: doc.featured,
        }));
      }
    }

    // Fallback or external search query via service
    if (items.length === 0) {
      items = await entertainmentService.getExploreContent({
        type,
        search,
        limit: parseInt(limit, 10) || 40,
      });
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('[Content Explore Error]', error);
    res.status(500).json({ message: error.message || 'Gagal memuat konten' });
  }
};

// @desc Get featured banner items
// @route GET /api/content/featured
const getFeaturedBanners = async (req, res) => {
  try {
    const banners = entertainmentService.getFeaturedBanners();
    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal memuat banner' });
  }
};

// @desc Get content detail
// @route GET /api/content/detail/:type/:id
const getContentDetail = async (req, res) => {
  try {
    const { type, id } = req.params;
    const item = await entertainmentService.getDetail(type, id);

    let isFavorited = false;
    if (req.user) {
      const fav = await Favorite.findOne({ userId: req.user._id, contentId: id });
      isFavorited = !!fav;
    }

    // Also get average user rating from our MongoDB reviews
    const reviews = await Review.find({ contentId: id });
    let communityRating = item.rating;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      const communityAvg = (sum / reviews.length) * 2; // scale 5-star to 10
      communityRating = parseFloat(((item.rating + communityAvg) / 2).toFixed(1));
    }

    res.json({
      success: true,
      data: {
        ...item,
        rating: communityRating,
        isFavorited,
        totalReviews: reviews.length,
      },
    });
  } catch (error) {
    console.error('[Content Detail Error]', error);
    res.status(500).json({ message: error.message || 'Gagal memuat detail konten' });
  }
};

module.exports = {
  getExploreContent,
  getFeaturedBanners,
  getContentDetail,
};
