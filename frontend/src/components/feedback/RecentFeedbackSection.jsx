import React from 'react';
import FeedbackCard from './FeedbackCard';

const RecentFeedbackSection = ({ feedback, loading, onViewAll }) => {
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
          <FeedbackCard 
            key={fb.id || i} 
            {...fb}
            avatar={fb.employee?.avatar || ''}
            name={fb.employee_name || 'Unknown Employee'}
            role={fb.role || 'Employee'}
            date={new Date(fb.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            sentiment={fb.sentiment}
            sentimentLabel={fb.sentiment?.charAt(0).toUpperCase() + fb.sentiment?.slice(1)}
            strengths={fb.strengths ? [fb.strengths] : []}
            improvements={fb.areas_to_improve ? [fb.areas_to_improve] : []}
            tags={fb.tags || []}
            commentsCount={fb.comments_count || 0}
            acknowledged={fb.acknowledged || false}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentFeedbackSection; 