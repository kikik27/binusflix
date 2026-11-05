const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const Review = require('../models/Review');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretentertainmenthubkey2026_binus',
    { expiresIn: '30d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Mohon isi semua field yang wajib' });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (userExists) {
      if (userExists.email === email.toLowerCase()) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
      fullName: fullName || username,
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ message: error.message || 'Gagal melakukan registrasi' });
  }
};

// @desc Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Mohon masukkan email dan password' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Email atau username tidak ditemukan' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    res.json({
      message: 'Login berhasil',
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ message: error.message || 'Gagal login' });
  }
};

// @desc Get current user profile & stats
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const totalFavorites = await Favorite.countDocuments({ userId: user._id });
    const totalReviews = await Review.countDocuments({ userId: user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        totalFavorites,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal mengambil data profil' });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Gagal memperbarui profil' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
