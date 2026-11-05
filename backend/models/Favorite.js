const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contentId: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['movie', 'tv', 'music'],
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    posterUrl: {
      type: String,
      default: '',
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    genre: {
      type: String,
      default: '',
    },
    durationOrAlbum: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate favorites per user
favoriteSchema.index({ userId: 1, contentId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
