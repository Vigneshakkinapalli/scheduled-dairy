const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    default: 'Untitled',
  },
  content: {
    type: String,
    default: '',
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  favorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
noteSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
noteSchema.index({ user: 1, updatedAt: -1 });
noteSchema.index({ user: 1, favorite: 1 });

module.exports = mongoose.model('Note', noteSchema);
