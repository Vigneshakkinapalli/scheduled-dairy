const express = require('express');
const router = express.Router();
const DailySheet = require('../models/DailySheet');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @route   GET /api/history
// @desc    Get all daily sheets with pagination and filtering
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, search } = req.query;
    
    let query = { user: req.user._id };
    
    // Date filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    // Search by task title
    if (search) {
      query['tasks.title'] = { $regex: search, $options: 'i' };
    }
    
    const sheets = await DailySheet.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await DailySheet.countDocuments(query);
    
    res.json({
      sheets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/history/:id
// @desc    Get a specific daily sheet
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const sheet = await DailySheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Daily sheet not found' });
    }
    
    // Check if sheet belongs to user
    if (sheet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/history
// @desc    Save current day's tasks as a daily sheet
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { date } = req.body;
    
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queryDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Get all tasks for the specified date
    const tasks = await Task.find({
      user: req.user._id,
      date: {
        $gte: queryDate,
        $lt: nextDay,
      },
    }).sort({ order: 1, startTime: 1 });
    
    if (tasks.length === 0) {
      return res.status(400).json({ message: 'No tasks found for this date' });
    }
    
    // Check if sheet already exists for this date
    const existingSheet = await DailySheet.findOne({
      user: req.user._id,
      date: queryDate,
    });
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    const taskData = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      startTime: task.startTime,
      endTime: task.endTime,
      completed: task.completed,
      order: task.order,
    }));
    
    let sheet;
    
    if (existingSheet) {
      // Update existing sheet
      sheet = await DailySheet.findByIdAndUpdate(
        existingSheet._id,
        {
          tasks: taskData,
          totalTasks,
          completedTasks,
          completionPercentage,
        },
        { new: true }
      );
    } else {
      // Create new sheet
      sheet = await DailySheet.create({
        user: req.user._id,
        date: queryDate,
        tasks: taskData,
        totalTasks,
        completedTasks,
        completionPercentage,
      });
    }
    
    res.status(201).json(sheet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/history/:id/restore
// @desc    Restore a daily sheet as today's tasks
// @access  Private
router.post('/:id/restore', protect, async (req, res) => {
  try {
    const sheet = await DailySheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Daily sheet not found' });
    }
    
    // Check if sheet belongs to user
    if (sheet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    // Create tasks from the sheet
    const taskPromises = sheet.tasks.map((task, index) =>
      Task.create({
        user: req.user._id,
        title: task.title,
        description: task.description,
        startTime: task.startTime,
        endTime: task.endTime,
        completed: false, // Reset completion status
        date: targetDate,
        order: task.order !== undefined ? task.order : index,
      })
    );
    
    const createdTasks = await Promise.all(taskPromises);
    
    res.json({
      message: 'Daily sheet restored successfully',
      tasks: createdTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/history/:id
// @desc    Delete a daily sheet
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const sheet = await DailySheet.findById(req.params.id);
    
    if (!sheet) {
      return res.status(404).json({ message: 'Daily sheet not found' });
    }
    
    // Check if sheet belongs to user
    if (sheet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await DailySheet.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Daily sheet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
