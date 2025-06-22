import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Modal, IconButton, Typography, Button, CircularProgress } from '@mui/material';
import { useManagerDashboardStore } from '../../store/useManagerDashboardStore';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function TeamMemberModal({ open, onClose, member }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [memberFeedback, setMemberFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const { recentFeedback } = useManagerDashboardStore();

  useEffect(() => {
    if (member && open) {
      // Filter feedback for this specific member
      const feedback = recentFeedback.filter(fb => fb.employee_id === member.id);
      setMemberFeedback(feedback);
    }
  }, [member, open, recentFeedback]);

  if (!member) return null;

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
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Member Info */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-user-line text-3xl"></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-gray-500 mb-2">{member.email}</p>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {member.role}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{memberFeedback.length}</div>
          <div className="text-sm text-gray-500">Total Feedback</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {memberFeedback.filter(fb => fb.acknowledged).length}
          </div>
          <div className="text-sm text-gray-500">Acknowledged</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {memberFeedback.filter(fb => fb.sentiment === 'positive').length}
          </div>
          <div className="text-sm text-gray-500">Positive</div>
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="space-y-4">
      {memberFeedback.length === 0 ? (
        <div className="text-center py-8">
          <i className="ri-feedback-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No feedback given yet</p>
        </div>
      ) : (
        memberFeedback.map((feedback) => (
          <div key={feedback.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                <i className={`${getSentimentIcon(feedback.sentiment)} mr-1`}></i>
                {feedback.sentiment}
              </span>
              <span className="text-sm text-gray-500">{formatDate(feedback.created_at)}</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Strengths</h4>
                <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                  {feedback.strengths}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Areas to Improve</h4>
                <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                  {feedback.areas_to_improve}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                {feedback.acknowledged ? 'Acknowledged' : 'Pending acknowledgment'}
              </span>
              {feedback.acknowledged && (
                <span className="text-xs text-green-600">
                  <i className="ri-check-line mr-1"></i>
                  Acknowledged
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <Modal 
          open={open} 
          onClose={onClose} 
          className="flex items-center justify-center p-4"
        >
          <Box 
            component={motion.div}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative outline-none max-h-[90vh] overflow-y-auto"
          >
            <IconButton 
              onClick={onClose} 
              className="!absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <i className="ri-close-line ri-lg"></i>
            </IconButton>
            
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                  Team Member Profile
                </Typography>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('feedback')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'feedback'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Feedback History ({memberFeedback.length})
                </button>
              </div>

              {/* Content */}
              {activeTab === 'overview' ? renderOverview() : renderFeedback()}
            </div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
} 