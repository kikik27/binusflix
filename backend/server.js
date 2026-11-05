const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch((err) => {
  console.error('[Server Error] Initial MongoDB connection error:', err.message);
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Root Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'BINUSFLIX API (BINUS Final Project)',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (register, login, me)',
      content: '/api/content (explore, featured, detail)',
      favorites: '/api/favorites (get, add, delete, check)',
      reviews: '/api/reviews (get, create, delete)',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Middleware to ensure DB is connected before handling DB requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Database connection error. Pastikan koneksi internet aktif dan IP MongoDB Atlas diizinkan.',
      error: error.message,
    });
  }
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint ${req.originalUrl} tidak ditemukan` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Terjadi kesalahan pada server',
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Entertainment Hub Backend Server Running!`);
    console.log(`📍 Local:   http://localhost:${PORT}`);
    console.log(`📡 Network: http://0.0.0.0:${PORT}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
