import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsFilters({
  timeRange,
  employee,
  chartType,
  teamMembers,
  onTimeRangeChange,
  onEmployeeChange,
  onChartTypeChange,
}) {
  const timeRangeOptions = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' },
  ];

  const chartTypeOptions = [
    { value: 'sentiment', label: 'By Sentiment' },
    { value: 'employee', label: 'By Employee' },
    { value: 'month', label: 'By Month' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Filters</h3>
        <div className="flex items-center space-x-2">
          <i className="ri-filter-3-line text-primary"></i>
          <span className="text-sm text-gray-500">Filter Options</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Employee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee
          </label>
          <select
            value={employee}
            onChange={(e) => onEmployeeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Employees</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chart Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {chartTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active Filters:</span>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
              {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
            </span>
            {employee !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {teamMembers.find(m => m.id === parseInt(employee))?.name || 'Employee'}
              </span>
            )}
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {chartTypeOptions.find(opt => opt.value === chartType)?.label}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 