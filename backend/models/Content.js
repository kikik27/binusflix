const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    contentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['movie', 'tv', 'music'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    overview: {
      type: String,
      default: '',
    },
    posterUrl: {
      type: String,
      required: true,
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
      default: 8.0,
      min: 0,
      max: 10,
    },
    voteCount: {
      type: Number,
      default: 100,
    },
    genre: {
      type: String,
      default: 'Entertainment',
    },
    durationOrAlbum: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    trailerKey: {
      type: String,
      default: '',
    },
    previewUrl: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ title: 'text', overview: 'text', genre: 'text' });

module.exports = mongoose.model('Content', contentSchema);
