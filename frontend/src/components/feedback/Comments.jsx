import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button, TextField, Box, IconButton } from '@mui/material';
import { useCommentsStore } from '../../store/useCommentsStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Comments({ feedbackId }) {
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuthStore();
  
  const {
    comments,
    loading,
    error,
    getComments,
    createComment,
    getCommentsForFeedback,
    clearError,
  } = useCommentsStore();

  const feedbackComments = getCommentsForFeedback(feedbackId);
  
  // Check if user is an employee (can add comments)
  const canAddComments = user?.role === 'employee';

  useEffect(() => {
    if (feedbackId) {
      getComments(feedbackId);
    }
  }, [feedbackId, getComments]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !canAddComments) return;

    try {
      await createComment(feedbackId, newComment.trim());
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment. Please try again.');
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !canAddComments) return;

    try {
      await createComment(feedbackId, newComment.trim());
      setNewComment('');
      toast.success('Comment sent successfully!');
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to send comment. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
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

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mt-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <i className="ri-chat-3-line mr-2 text-primary"></i>
          Comments ({feedbackComments.length})
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          {isExpanded ? 'Hide' : 'Show'} Comments
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Add Comment Form - Only for Employees */}
            {canAddComments && (
              <div className="bg-gray-50 rounded-lg p-4">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                      Add a comment
                    </label>
                    <TextField
                      id="comment"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your thoughts on this feedback..."
                      multiline
                      rows={3}
                      variant="outlined"
                      fullWidth
                      disabled={loading.create}
                      className="mb-3"
                      InputProps={{
                        style: { 
                          backgroundColor: 'white',
                          borderRadius: '8px'
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outlined"
                      onClick={() => setNewComment('')}
                      disabled={!newComment.trim() || loading.create}
                      className="px-4 py-2"
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSendComment}
                      disabled={!newComment.trim() || loading.create}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
                      startIcon={
                        loading.create ? (
                          <i className="ri-loader-4-line animate-spin"></i>
                        ) : (
                          <i className="ri-send-plane-fill"></i>
                        )
                      }
                    >
                      {loading.create ? 'Sending...' : 'Send Comment'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {loading.get ? (
                // Loading skeleton
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : feedbackComments.length === 0 ? (
                // Empty state
                <div className="text-center py-8">
                  <i className="ri-chat-3-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">
                    {canAddComments 
                      ? "No comments yet. Be the first to share your thoughts!" 
                      : "No comments yet."
                    }
                  </p>
                </div>
              ) : (
                // Comments list
                <div className="space-y-3">
                  {feedbackComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {/* User Avatar */}
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(comment.user_name || user?.name || 'User')}
                        </div>
                        
                        {/* Comment Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.user_name || user?.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 