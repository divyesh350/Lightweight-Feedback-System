import React from 'react';
import { motion } from 'framer-motion';

export default function EmployeePerformanceChart({ data, teamMembers, selectedEmployee, loading }) {
  // Process data to get employee performance metrics
  const processEmployeeData = () => {
    if (!data || !teamMembers) return [];

    const employeeStats = teamMembers.map(member => {
      const memberFeedback = data.filter(fb => fb.employee_id === member.id);
      const totalFeedback = memberFeedback.length;
      const positiveFeedback = memberFeedback.filter(fb => fb.sentiment === 'positive').length;
      const acknowledgedFeedback = memberFeedback.filter(fb => fb.acknowledged).length;
      
      const positiveRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback * 100).toFixed(1) : 0;
      const acknowledgmentRate = totalFeedback > 0 ? (acknowledgedFeedback / totalFeedback * 100).toFixed(1) : 0;

      return {
        id: member.id,
        name: member.name,
        totalFeedback,
        positiveRate: parseFloat(positiveRate),
        acknowledgmentRate: parseFloat(acknowledgmentRate),
        avgRating: totalFeedback > 0 ? (positiveFeedback / totalFeedback * 5).toFixed(1) : 0,
      };
    });

    // Filter by selected employee if not 'all'
    if (selectedEmployee !== 'all') {
      return employeeStats.filter(emp => emp.id === parseInt(selectedEmployee));
    }

    return employeeStats.sort((a, b) => b.totalFeedback - a.totalFeedback);
  };

  const employeeData = processEmployeeData();

  if (loading) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (employeeData.length === 0) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <i className="ri-bar-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No performance data available</p>
        </div>
      </div>
    );
  }

  const maxFeedback = Math.max(...employeeData.map(emp => emp.totalFeedback));
  const maxPositiveRate = Math.max(...employeeData.map(emp => emp.positiveRate));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-feedback-line"></i>
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Feedback</p>
              <p className="text-xl font-bold text-blue-900">
                {employeeData.reduce((sum, emp) => sum + emp.totalFeedback, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-emotion-happy-line"></i>
            </div>
            <div>
              <p className="text-sm text-green-600">Avg. Positive Rate</p>
              <p className="text-xl font-bold text-green-900">
                {(employeeData.reduce((sum, emp) => sum + emp.positiveRate, 0) / employeeData.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-check-line"></i>
            </div>
            <div>
              <p className="text-sm text-purple-600">Avg. Acknowledgment</p>
              <p className="text-xl font-bold text-purple-900">
                {(employeeData.reduce((sum, emp) => sum + emp.acknowledgmentRate, 0) / employeeData.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance Bars */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Employee Performance Breakdown</h4>
        
        {employeeData.map((employee, index) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{employee.name}</h5>
                  <p className="text-sm text-gray-500">{employee.totalFeedback} feedback given</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{employee.avgRating}/5</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
            </div>

            {/* Performance Bars */}
            <div className="space-y-2">
              {/* Feedback Count Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-20">Feedback:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(employee.totalFeedback / maxFeedback) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {employee.totalFeedback}
                </span>
              </div>

              {/* Positive Rate Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-20">Positive:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${employee.positiveRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {employee.positiveRate}%
                </span>
              </div>

              {/* Acknowledgment Rate Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-20">Acknowledged:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${employee.acknowledgmentRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {employee.acknowledgmentRate}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 