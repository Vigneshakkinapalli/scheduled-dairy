import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  FiCalendar,
  FiSearch,
  FiTrash2,
  FiEye,
  FiRotateCcw,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import api from '../utils/api';
import { format } from 'date-fns';

const History = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchSheets();
  }, [currentPage, searchTerm, startDate, endDate]);

  const fetchSheets = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get('/history', { params });
      setSheets(response.data.sheets);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this daily sheet?')) return;

    try {
      await api.delete(`/history/${id}`);
      toast.success('Sheet deleted successfully');
      fetchSheets();
    } catch (error) {
      toast.error('Failed to delete sheet');
    }
  };

  const handleRestore = async (sheet) => {
    try {
      await api.post(`/history/${sheet._id}/restore`, {
        date: new Date().toISOString().split('T')[0],
      });
      toast.success('Sheet restored to today\'s tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to restore sheet');
    }
  };

  const handleViewDetails = (sheet) => {
    setSelectedSheet(sheet);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedSheet(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Task History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your past daily task sheets
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search in tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {(searchTerm || startDate || endDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStartDate('');
              setEndDate('');
              setCurrentPage(1);
            }}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Sheets List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : sheets.length === 0 ? (
          <div className="p-12 text-center">
            <FiCalendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No history found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Save your daily sheets to see them here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sheets.map((sheet) => (
              <div
                key={sheet._id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FiCalendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {format(new Date(sheet.date), 'MMMM dd, yyyy')}
                      </h3>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tasks:</span>
                        <span>{sheet.totalTasks}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Completed:</span>
                        <span className="text-green-600 dark:text-green-400">
                          {sheet.completedTasks}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Progress:</span>
                        <span className="font-semibold text-primary-600 dark:text-primary-400">
                          {sheet.completionPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                        style={{ width: `${sheet.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(sheet)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRestore(sheet)}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Restore"
                    >
                      <FiRotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sheet._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {format(new Date(selectedSheet.date), 'MMMM dd, yyyy')}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Tasks: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedSheet.totalTasks}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Completed: </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {selectedSheet.completedTasks}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Progress: </span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {selectedSheet.completionPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tasks
              </h3>
              <div className="space-y-3">
                {selectedSheet.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {task.completed && <FiCheck className="w-4 h-4 text-white" />}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            task.completed
                              ? 'line-through text-gray-500 dark:text-gray-400'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {task.startTime} - {task.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
