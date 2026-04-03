const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Material = require('../models/Material');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get user profile with basic info
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/profile/stats
// @desc    Get user performance statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // Get user info for account age
    const user = await User.findById(userId).select('name email createdAt');
    const accountCreatedAt = user.createdAt;
    const daysSinceJoining = Math.floor((now - new Date(accountCreatedAt)) / (1000 * 60 * 60 * 24));

    // Get all tasks for the user
    const allTasks = await Task.find({ user: userId });
    const completedTasks = allTasks.filter(task => task.completed);
    
    // Calculate task completion rate
    const totalTasks = allTasks.length;
    const completedTasksCount = completedTasks.length;
    const taskCompletionRate = totalTasks > 0 
      ? Math.round((completedTasksCount / totalTasks) * 100) 
      : 0;

    // Get today's stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });
    const todayCompleted = todayTasks.filter(task => task.completed).length;
    const todayTotal = todayTasks.length;

    // Get this week's stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekTasks = await Task.find({
      user: userId,
      date: { $gte: weekStart }
    });
    const weekCompleted = weekTasks.filter(task => task.completed).length;
    const weekTotal = weekTasks.length;

    // Get this month's stats
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTasks = await Task.find({
      user: userId,
      date: { $gte: monthStart }
    });
    const monthCompleted = monthTasks.filter(task => task.completed).length;
    const monthTotal = monthTasks.length;

    // Calculate streak (consecutive days with at least one completed task)
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    while (true) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTasks = await Task.find({
        user: userId,
        date: { $gte: dayStart, $lte: dayEnd },
        completed: true
      });

      if (dayTasks.length > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Check if it's today and there are tasks scheduled but not completed yet
        if (currentStreak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStart = new Date(checkDate);
          const yesterdayEnd = new Date(checkDate);
          yesterdayEnd.setHours(23, 59, 59, 999);

          const yesterdayCompleted = await Task.find({
            user: userId,
            date: { $gte: yesterdayStart, $lte: yesterdayEnd },
            completed: true
          });

          if (yesterdayCompleted.length > 0) {
            currentStreak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
        }
        break;
      }

      // Prevent infinite loop
      if (currentStreak > 365) break;
    }

    // Get longest streak (simplified - based on completed tasks grouping)
    const completedDates = await Task.aggregate([
      { $match: { user: userId, completed: true } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    for (const item of completedDates) {
      const currentDate = new Date(item._id);
      if (prevDate) {
        const diffDays = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Get notes and materials count
    const totalNotes = await Note.countDocuments({ user: userId });
    const favoriteNotes = await Note.countDocuments({ user: userId, favorite: true });
    const totalMaterials = await Material.countDocuments({ user: userId });

    // Get productivity by day of week
    const productivityByDay = await Task.aggregate([
      { $match: { user: userId, completed: true } },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyProductivity = daysOfWeek.map((day, index) => {
      const found = productivityByDay.find(p => p._id === index + 1);
      return {
        day,
        completed: found ? found.count : 0
      };
    });

    // Recent activity (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const dayTasks = await Task.find({
        user: userId,
        date: { $gte: date, $lte: endDate }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.completed).length
      });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        memberSince: accountCreatedAt,
        daysSinceJoining
      },
      overview: {
        totalTasks,
        completedTasks: completedTasksCount,
        taskCompletionRate,
        totalNotes,
        favoriteNotes,
        totalMaterials
      },
      streaks: {
        current: currentStreak,
        longest: longestStreak
      },
      today: {
        total: todayTotal,
        completed: todayCompleted,
        rate: todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0
      },
      thisWeek: {
        total: weekTotal,
        completed: weekCompleted,
        rate: weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
      },
      thisMonth: {
        total: monthTotal,
        completed: monthCompleted,
        rate: monthTotal > 0 ? Math.round((monthCompleted / monthTotal) * 100) : 0
      },
      weeklyProductivity,
      recentActivity: last7Days
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
