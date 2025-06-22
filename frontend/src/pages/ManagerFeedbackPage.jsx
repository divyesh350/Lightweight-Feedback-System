import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import DashboardHeader from '../components/layout/DashboardHeader';
import FeedbackFormModal from '../components/modals/FeedbackFormModal';
import { useManagerDashboardStore } from '../store/useManagerDashboardStore';
import { useAuthStore } from '../store/useAuthStore';

function getToday() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ManagerFeedbackPage() {
  const navigate = useNavigate();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const { user } = useAuthStore();
  const {
    recentFeedback,
    loading,
    error,
    loadRecentFeedback,
    clearError,
  } = useManagerDashboardStore();

  // Load feedback data on component mount
  useEffect(() => {
    loadRecentFeedback();
  }, [loadRecentFeedback]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleNewFeedback = () => {
    setEditingFeedback(null);
    setFeedbackModalOpen(true);
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    // Refresh feedback data after successful creation/update
    loadRecentFeedback();
  };

  const handleRefresh = () => {
    loadRecentFeedback();
    toast.success('Feedback refreshed!');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'neutral': return 'text-yellow-600 bg-yellow-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'ri-emotion-happy-line';
      case 'neutral': return 'ri-emotion-normal-line';
      case 'negative': return 'ri-emotion-unhappy-line';
      default: return 'ri-emotion-line';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar notifications={3} />
        <MainContainer>
          <DashboardHeader
            title="Feedback Management"
            date={getToday()}
            onNewFeedback={handleNewFeedback}
            onRefresh={handleRefresh}
            loading={loading.feedback}
          />
          
          {/* Feedback List */}
          <div className="space-y-6">
            {loading.feedback ? (
              // Loading skeleton
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentFeedback.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <i className="ri-feedback-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Feedback Yet</h3>
                <p className="text-gray-500 mb-6">Start providing feedback to your team members to help them grow.</p>
                <button
                  onClick={handleNewFeedback}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Send First Feedback
                </button>
              </div>
            ) : (
              // Feedback list
              <div className="space-y-4">
                {recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
                          <i className="ri-user-line"></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {feedback.employee_name || 'Employee'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {feedback.employee_email || 'employee@example.com'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(feedback.sentiment)}`}>
                          <i className={`${getSentimentIcon(feedback.sentiment)} mr-1`}></i>
                          {feedback.sentiment}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(feedback.created_at)}
                        </span>
                        <button
                          onClick={() => handleEditFeedback(feedback)}
                          className="text-primary hover:text-primary-dark transition-colors"
                          title="Edit feedback"
                        >
                          <i className="ri-edit-line"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                        <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                          {feedback.strengths}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Areas to Improve</h4>
                        <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">
                          {feedback.areas_to_improve}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            <i className="ri-time-line mr-1"></i>
                            {feedback.acknowledged ? 'Acknowledged' : 'Pending acknowledgment'}
                          </span>
                        </div>
                        {feedback.acknowledged && (
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
            )}
          </div>
        </MainContainer>
      </div>

      {/* Feedback Form Modal */}
      <FeedbackFormModal
        open={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setEditingFeedback(null);
        }}
        initialData={editingFeedback}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
} 