import React from 'react';
import StatCard from './StatCard';

const DashboardStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: 'ri-feedback-line',
      label: 'Total Feedback',
      value: stats.totalFeedback,
      change: '+12.5%',
      color: 'blue',
      trend: 'up',
    },
    {
      icon: 'ri-emotion-happy-line',
      label: 'Positive Sentiment',
      value: `${stats.positiveSentiment}%`,
      change: '+5.3%',
      color: 'green',
      trend: 'up',
    },
    {
      icon: 'ri-time-line',
      label: 'Pending Reviews',
      value: stats.pendingReviews,
      change: '+8.2%',
      color: 'yellow',
      trend: 'up',
    },
    {
      icon: 'ri-team-line',
      label: 'Team Members',
      value: stats.teamMembers,
      change: '+2 new',
      color: 'purple',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats; 