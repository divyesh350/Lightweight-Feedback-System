import React from 'react';
import { motion } from 'framer-motion';

export default function TeamStatsOverview({ stats, loading }) {
  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: 'ri-team-line',
      color: 'bg-blue-500',
      description: 'Direct reports'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: 'ri-user-star-line',
      color: 'bg-green-500',
      description: 'Currently active'
    },
    {
      title: 'Total Feedback',
      value: stats.totalFeedback,
      icon: 'ri-feedback-line',
      color: 'bg-purple-500',
      description: 'Given this month'
    },
    {
      title: 'Team Satisfaction',
      value: `${stats.averageSentiment}%`,
      icon: 'ri-emotion-happy-line',
      color: 'bg-yellow-500',
      description: 'Average sentiment'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-lg flex items-center justify-center`}>
              <i className={`${stat.icon} text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 