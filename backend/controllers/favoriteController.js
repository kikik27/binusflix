const Favorite = require('../models/Favorite');

// @desc Get all favorites of logged-in user
// @route GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    let { type, page = 1, limit = 20 } = req.query;
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (type && type !== 'all') {
      filter.contentType = type;
    }

    const totalItems = await Favorite.countDocuments(filter);
    const favorites = await Favorite.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.json({
      success: true,
      count: favorites.length,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasMore: page < totalPages,
      },
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Gagal memuat daftar favorit',
    });
  }
};

// @desc Add item to favorites
// @route POST /api/favorites
const addFavorite = async (req, res) => {
  try {
    const {
      contentId,
      contentType,
      title,
      subtitle,
      posterUrl,
      backdropUrl,
      releaseDate,
      rating,
      genre,
      durationOrAlbum,
    } = req.body;

    if (!contentId || !contentType || !title) {
      return res.status(400).json({ message: 'Data konten tidak lengkap' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.user._id,
      contentId,
    });

    if (existing) {
      return res.status(400).json({ message: 'Konten sudah ada dalam daftar favorit' });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      contentId,
      contentType,
      title,
      subtitle: subtitle || '',
      posterUrl: posterUrl || '',
      backdropUrl: backdropUrl || '',
      releaseDate: releaseDate || '',
      rating: rating || 0,
      genre: genre || '',
      durationOrAlbum: durationOrAlbum || '',
    });

    res.status(201).json({
      success: true,
      message: 'Berhasil ditambahkan ke daftar favorit',
      data: favorite,
    });
  } catch (error) {
    console.error('[Add Favorite Error]', error);
    res.status(500).json({ message: error.message || 'Gagal menambahkan ke favorit' });
  }
};

// @desc Remove item from favorites
// @route DELETE /api/favorites/:contentId
const removeFavorite = async (req, res) => {
  try {
    const { contentId } = req.params;
    const deleted = await Favorite.findOneAndDelete({
      userId: req.user._id,
      contentId,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Konten tidak ditemukan dalam daftar favorit' });
    }

    res.json({
      success: true,
      message: 'Berhasil dihapus dari daftar favorit',
      contentId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal menghapus dari favorit' });
  }
};

// @desc Check if content is favorited
// @route GET /api/favorites/check/:contentId
const checkFavorite = async (req, res) => {
  try {
    const { contentId } = req.params;
    const favorite = await Favorite.findOne({
      userId: req.user._id,
      contentId,
    });

    res.json({
      isFavorited: !!favorite,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal memeriksa status favorit' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
};
