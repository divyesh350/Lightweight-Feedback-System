import React from 'react';
import { motion } from 'framer-motion';

export default function AnalyticsInsights({ insights, loading }) {
  // Safety check for insights data
  if (!insights) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const insightCards = [
    {
      title: 'Total Feedback',
      value: insights.totalFeedback || 0,
      icon: 'ri-feedback-line',
      color: 'bg-blue-500',
      description: 'All time feedback given',
      trend: '+12% from last month',
      trendColor: 'text-green-600',
    },
    {
      title: 'This Month',
      value: insights.currentMonthFeedback || 0,
      icon: 'ri-calendar-line',
      color: 'bg-green-500',
      description: 'Feedback this month',
      trend: '+5 from last month',
      trendColor: 'text-green-600',
    },
    {
      title: 'Avg. per Month',
      value: insights.avgFeedbackPerMonth || 0,
      icon: 'ri-bar-chart-line',
      color: 'bg-purple-500',
      description: 'Average monthly feedback',
      trend: '+0.3 from average',
      trendColor: 'text-green-600',
    },
    {
      title: 'Positive Rate',
      value: `${insights.positivePercentage || 0}%`,
      icon: 'ri-emotion-happy-line',
      color: 'bg-yellow-500',
      description: 'Positive feedback percentage',
      trend: '+2.1% from last month',
      trendColor: 'text-green-600',
    },
    {
      title: 'Acknowledgment Rate',
      value: `${insights.acknowledgmentRate || 0}%`,
      icon: 'ri-check-line',
      color: 'bg-indigo-500',
      description: 'Feedback acknowledgment rate',
      trend: '+8.5% from last month',
      trendColor: 'text-green-600',
    },
    {
      title: 'Team Size',
      value: insights.teamSize || 0,
      icon: 'ri-team-line',
      color: 'bg-pink-500',
      description: 'Total team members',
      trend: '+1 new member',
      trendColor: 'text-blue-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {insightCards.map((insight, index) => (
        <motion.div
          key={insight.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${insight.color} text-white rounded-lg flex items-center justify-center`}>
              <i className={`${insight.icon} text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">{insight.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
              <p className="text-xs text-gray-400">{insight.description}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <i className="ri-arrow-up-line text-sm"></i>
              <span className={`text-xs font-medium ${insight.trendColor}`}>
                {insight.trend}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 