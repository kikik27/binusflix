const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    contentId: {
      type: String,
      required: true,
      index: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['movie', 'tv', 'music'],
    },
    contentTitle: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating wajib diberikan'],
      min: [1, 'Rating minimal 1 bintang'],
      max: [5, 'Rating maksimal 5 bintang'],
    },
    reviewText: {
      type: String,
      required: [true, 'Ulasan wajib diisi'],
      trim: true,
      minlength: [5, 'Ulasan minimal 5 karakter'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
