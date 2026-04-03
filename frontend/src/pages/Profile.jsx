import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiTrendingUp,
  FiAward,
  FiFileText,
  FiBook,
  FiTarget,
  FiZap,
  FiStar,
} from 'react-icons/fi';
import api from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const response = await api.get('/profile/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Failed to load profile data</p>
      </div>
    );
  }

  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-yellow-500';
    if (streak >= 14) return 'text-orange-500';
    if (streak >= 7) return 'text-green-500';
    return 'text-blue-500';
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <FiUser className="w-12 h-12" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{stats.user.name}</h1>
            <p className="text-primary-100 mt-1">{stats.user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-primary-100">
              <FiCalendar className="w-4 h-4" />
              <span>Member since {formatDate(stats.user.memberSince)}</span>
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
                {stats.user.daysSinceJoining} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
              <p className={`text-4xl font-bold mt-2 ${getStreakColor(stats.streaks.current)}`}>
                {stats.streaks.current} <span className="text-lg">days</span>
              </p>
            </div>
            <div className={`p-4 rounded-full bg-orange-100 dark:bg-orange-900/30`}>
              <FiZap className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {stats.streaks.current > 0 
              ? "Keep it going! Complete tasks daily to maintain your streak."
              : "Start your streak by completing a task today!"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
              <p className="text-4xl font-bold mt-2 text-purple-500">
                {stats.streaks.longest} <span className="text-lg">days</span>
              </p>
            </div>
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <FiAward className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Your personal best! Can you beat it?
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FiTarget className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.completedTasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <FiFileText className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalNotes}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <FiBook className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overview.totalMaterials}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Rate Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5 text-primary-500" />
          Task Completion Rate
        </h2>
        
        <div className="space-y-6">
          {/* Today */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Today</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.today.completed}/{stats.today.total} tasks ({stats.today.rate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(stats.today.rate)}`}
                style={{ width: `${stats.today.rate}%` }}
              ></div>
            </div>
          </div>

          {/* This Week */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Week</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.thisWeek.completed}/{stats.thisWeek.total} tasks ({stats.thisWeek.rate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(stats.thisWeek.rate)}`}
                style={{ width: `${stats.thisWeek.rate}%` }}
              ></div>
            </div>
          </div>

          {/* This Month */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">This Month</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.thisMonth.completed}/{stats.thisMonth.total} tasks ({stats.thisMonth.rate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(stats.thisMonth.rate)}`}
                style={{ width: `${stats.thisMonth.rate}%` }}
              ></div>
            </div>
          </div>

          {/* Overall */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.overview.completedTasks}/{stats.overview.totalTasks} tasks ({stats.overview.taskCompletionRate}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(stats.overview.taskCompletionRate)}`}
                style={{ width: `${stats.overview.taskCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Productivity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiStar className="w-5 h-5 text-yellow-500" />
          Productivity by Day of Week
        </h2>
        
        <div className="flex items-end justify-between gap-2 h-48">
          {stats.weeklyProductivity.map((day, index) => {
            const maxCompleted = Math.max(...stats.weeklyProductivity.map(d => d.completed), 1);
            const height = (day.completed / maxCompleted) * 100;
            
            return (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{day.completed}</span>
                <div
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max(height, 5)}%` }}
                ></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-blue-500" />
          Last 7 Days Activity
        </h2>
        
        <div className="grid grid-cols-7 gap-2">
          {stats.recentActivity.map((day, index) => {
            const rate = day.total > 0 ? (day.completed / day.total) * 100 : 0;
            let bgColor = 'bg-gray-100 dark:bg-gray-700';
            if (day.total > 0) {
              if (rate >= 80) bgColor = 'bg-green-500';
              else if (rate >= 50) bgColor = 'bg-yellow-500';
              else if (rate > 0) bgColor = 'bg-orange-500';
              else bgColor = 'bg-red-400';
            }

            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.getDate();

            return (
              <div key={day.date} className="flex flex-col items-center">
                <div
                  className={`w-full aspect-square rounded-lg ${bgColor} flex items-center justify-center transition-all duration-300 hover:scale-105`}
                  title={`${day.date}: ${day.completed}/${day.total} tasks completed`}
                >
                  <span className={`text-sm font-medium ${day.total > 0 && rate > 0 ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {dayNum}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dayName}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {day.completed}/{day.total}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700"></div>
            <span className="text-gray-600 dark:text-gray-400">No tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400"></div>
            <span className="text-gray-600 dark:text-gray-400">0%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500"></div>
            <span className="text-gray-600 dark:text-gray-400">&lt;50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">50-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">80%+</span>
          </div>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-lg">
        <div className="text-center">
          <p className="text-lg italic">
            {stats.overview.taskCompletionRate >= 80 
              ? "\"Excellent work! Your consistency is paying off. Keep pushing forward!\""
              : stats.overview.taskCompletionRate >= 50
              ? "\"Good progress! Stay focused and you'll reach your goals.\""
              : stats.overview.taskCompletionRate > 0
              ? "\"Every step counts. Keep building those habits!\""
              : "\"The journey of a thousand miles begins with a single step. Start today!\""}
          </p>
          <p className="mt-4 text-sm opacity-80">
            You've been productive for {stats.user.daysSinceJoining} days. Keep going!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
