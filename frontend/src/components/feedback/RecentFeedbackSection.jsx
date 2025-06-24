import React from 'react';
import FeedbackCard from './FeedbackCard';
import Comments from './Comments';

const RecentFeedbackSection = ({ feedback, loading, onViewAll, role }) => {
  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!feedback || !Array.isArray(feedback) || feedback.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Feedback</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <i className="ri-feedback-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No feedback found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Recent Feedback</h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <span>View All</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        )}
      </div>
      <div className="space-y-4">
        {feedback.slice(0, 5).map((fb, i) => (
          <div key={fb.id || i} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                  <i className="ri-user-line"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {fb.employee_name || 'Employee'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {fb.employee_email || 'employee@example.com'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  fb.sentiment === 'positive'
                    ? 'text-green-600 bg-green-50'
                    : fb.sentiment === 'neutral'
                    ? 'text-yellow-600 bg-yellow-50'
                    : fb.sentiment === 'negative'
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 bg-gray-50'
                }`}>
                  <i className={`${
                    fb.sentiment === 'positive'
                      ? 'ri-emotion-happy-line'
                      : fb.sentiment === 'neutral'
                      ? 'ri-emotion-normal-line'
                      : fb.sentiment === 'negative'
                      ? 'ri-emotion-unhappy-line'
                      : 'ri-emotion-line'
                  } mr-1`}></i>
                  {fb.sentiment}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(fb.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                  {fb.strengths}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Areas to Improve</h4>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                  {fb.areas_to_improve}
                </p>
              </div>
              {/* Comments Section */}
              <Comments feedbackId={fb.id} />
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    <i className="ri-time-line mr-1"></i>
                    {fb.acknowledged ? 'Acknowledged' : 'Pending acknowledgment'}
                  </span>
                </div>
                {fb.acknowledged && (
                  <span className="text-sm text-green-600">
                    <i className="ri-check-line mr-1"></i>
                    Acknowledged
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentFeedbackSection; 