const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretentertainmenthubkey2026_binus'
      );
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }
      return next();
    } catch (error) {
      console.error('[Auth Error]', error.message);
      return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token otentikasi tidak ditemukan' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretentertainmenthubkey2026_binus'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore token failure for optional endpoints
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
