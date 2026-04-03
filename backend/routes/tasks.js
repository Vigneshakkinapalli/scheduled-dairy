const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// @route   GET /api/tasks
// @desc    Get all tasks for a specific date
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = { user: req.user._id };
    
    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: queryDate,
        $lt: nextDay,
      };
    }
    
    const tasks = await Task.find(query).sort({ order: 1, startTime: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, startTime, endTime, date, order } = req.body;
    
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide title, start time, and end time' });
    }
    
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      startTime,
      endTime,
      date: date ? new Date(date) : undefined,
      order: order || 0,
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { title, description, startTime, endTime, completed, order, date } = req.body;
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, startTime, endTime, completed, order, date },
      { new: true, runValidators: true }
    );
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/tasks/reorder
// @desc    Reorder tasks
// @access  Private
router.put('/bulk/reorder', protect, async (req, res) => {
  try {
    const { tasks } = req.body; // Array of { id, order }
    
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks must be an array' });
    }
    
    const updatePromises = tasks.map(({ id, order }) =>
      Task.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { order },
        { new: true }
      )
    );
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
