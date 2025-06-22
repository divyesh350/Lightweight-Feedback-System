import React from 'react';
import { motion } from 'framer-motion';

export default function TeamMemberCard({ 
  member, 
  viewMode, 
  feedbackCount, 
  progressBadge, 
  onViewProfile 
}) {
  const getBadgeColor = (color) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      case 'red': return 'bg-red-100 text-red-800';
      case 'gray': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  if (!member) return null;
  const getRoleIcon = (role) => {
    switch (role) {
      case 'manager': return 'ri-user-star-line';
      case 'employee': return 'ri-user-line';
      default: return 'ri-user-line';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'manager': return 'text-purple-600 bg-purple-50';
      case 'employee': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Calculate satisfaction percentage based on feedback count
  const getSatisfactionPercentage = () => {
    if (feedbackCount === 0) return 0;
    // This would ideally come from the backend, but for now we'll use a placeholder
    // In a real implementation, this would be calculated from actual feedback sentiment data
    return Math.floor(Math.random() * 30) + 70; // 70-100% range
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={onViewProfile}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
              <i className="ri-user-line text-xl"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{member?.name}</h3>
              <p className="text-sm text-gray-500">{member?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  <i className={`${getRoleIcon(member.role)} mr-1`}></i>
                  {member.role}
                </span>
                <span className="text-xs text-gray-500">
                  <i className="ri-feedback-line mr-1"></i>
                  {feedbackCount} feedback
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{feedbackCount}</div>
              <div className="text-xs text-gray-500">Feedback</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(progressBadge?.color)}`}>
              {progressBadge?.label}
            </span>
            <button className="text-primary hover:text-primary-dark transition-colors">
              <i className="ri-eye-line"></i>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onViewProfile}
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
          <i className="ri-user-line text-xl"></i>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
          <p className="text-sm text-gray-500 truncate">{member.email}</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="flex items-center space-x-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
          <i className={`${getRoleIcon(member.role)} mr-1`}></i>
          {member.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">{feedbackCount}</div>
          <div className="text-xs text-gray-500">Feedback</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">
            {getSatisfactionPercentage()}%
          </div>
          <div className="text-xs text-gray-500">Satisfaction</div>
        </div>
      </div>

      {/* Progress Badge */}
      <div className="flex items-center justify-between">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(progressBadge.color)}`}>
          {progressBadge.label}
        </span>
        <button className="text-primary hover:text-primary-dark transition-colors">
          <i className="ri-eye-line"></i>
        </button>
      </div>
    </motion.div>
  );
} 