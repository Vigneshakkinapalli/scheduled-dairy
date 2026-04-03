import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            📅 Scheduled Dairy
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? (
              <FiSun className="w-5 h-5 text-yellow-500" />
            ) : (
              <FiMoon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
            <div className="flex items-center space-x-2">
              <FiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden md:block text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
