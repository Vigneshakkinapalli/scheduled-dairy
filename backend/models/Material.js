const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  semester: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['notes', 'books', 'papers', 'assignments', 'other'],
    default: 'other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
materialSchema.index({ user: 1, subject: 1 });
materialSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Material', materialSchema);
