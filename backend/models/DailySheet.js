const mongoose = require('mongoose');

const dailySheetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  tasks: [
    {
      title: String,
      description: String,
      startTime: String,
      endTime: String,
      completed: Boolean,
      order: Number,
    },
  ],
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  completionPercentage: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
dailySheetSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DailySheet', dailySheetSchema);
