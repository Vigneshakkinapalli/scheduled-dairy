import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiCheckSquare,
  FiClock,
  FiBook,
  FiFileText,
  FiWatch,
  FiTrendingUp,
} from 'react-icons/fi';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalMaterials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [tasksRes, notesRes, materialsRes] = await Promise.all([
        api.get(`/tasks?date=${today}`),
        api.get('/notes?limit=1'),
        api.get('/materials?limit=1'),
      ]);

      const todayTasks = tasksRes.data.length;
      const completedTasks = tasksRes.data.filter((t) => t.completed).length;

      setStats({
        todayTasks,
        completedTasks,
        totalNotes: notesRes.data.total || 0,
        totalMaterials: materialsRes.data.total || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      title: 'Task Scheduler',
      description: 'Create and manage your daily tasks',
      icon: FiCheckSquare,
      path: '/tasks',
      color: 'bg-blue-500',
    },
    {
      title: 'History',
      description: 'View past task sheets',
      icon: FiClock,
      path: '/history',
      color: 'bg-purple-500',
    },
    {
      title: 'Materials',
      description: 'Upload and organize study materials',
      icon: FiBook,
      path: '/materials',
      color: 'bg-green-500',
    },
    {
      title: 'Notes',
      description: 'Take notes like Notion',
      icon: FiFileText,
      path: '/notes',
      color: 'bg-yellow-500',
    },
    {
      title: 'Timer',
      description: 'Stopwatch and countdown timer',
      icon: FiWatch,
      path: '/timer',
      color: 'bg-red-500',
    },
  ];

  const completionPercentage = stats.todayTasks
    ? Math.round((stats.completedTasks / stats.todayTasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-primary-100 text-lg">
          Let's make today productive and organized
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Today's Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.todayTasks}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiCheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.completedTasks}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Notes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalNotes}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <FiFileText className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Materials</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? '...' : stats.totalMaterials}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      {stats.todayTasks > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Today's Progress
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {stats.completedTasks} of {stats.todayTasks} tasks completed
              </span>
              <span className="font-medium text-primary-600 dark:text-primary-400">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`${link.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
