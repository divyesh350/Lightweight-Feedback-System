import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import FeedbackCard from '../components/feedback/FeedbackCard';
import Comments from '../components/feedback/Comments';
import { useFeedbackStore } from '../store/useFeedbackStore';
import { useAuthStore } from '../store/useAuthStore';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

export default function EmployeeFeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { role } = useAuthStore();
  const { 
    feedbackList, 
    loading, 
    error, 
    loadEmployeeFeedback, 
    acknowledgeFeedback 
  } = useFeedbackStore();

  useEffect(() => {
    loadEmployeeFeedback();
  }, [loadEmployeeFeedback]);

  const handleAcknowledge = async (feedbackId) => {
    try {
      await acknowledgeFeedback(feedbackId);
      toast.success('Feedback acknowledged successfully!');
      // Refresh the feedback list
      loadEmployeeFeedback();
    } catch (error) {
      toast.error('Failed to acknowledge feedback');
    }
  };

  const handleComment = (feedback) => {
    setSelectedFeedback(feedback);
    setShowComments(true);
  };

  const handleEdit = (feedback) => {
    // For employees, editing might be limited or not allowed
    toast.info('Editing feedback is not available for employees');
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedFeedback(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'Positive';
      case 'neutral': return 'Neutral';
      case 'negative': return 'Negative';
      default: return 'Unknown';
    }
  };

  const getFeedbackStats = () => {
    if (!feedbackList.length) return { total: 0, acknowledged: 0, pending: 0 };
    
    const total = feedbackList.length;
    const acknowledged = feedbackList.filter(f => f.acknowledged).length;
    const pending = total - acknowledged;
    
    return { total, acknowledged, pending };
  };

  const stats = getFeedbackStats();

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="employee" />
        <div className="flex-1 flex flex-col">
          <Topbar user={mockUser} notifications={3} />
          <MainContainer>
            <Box className="flex justify-center items-center p-8">
              <CircularProgress />
            </Box>
          </MainContainer>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="employee" />
        <div className="flex-1 flex flex-col">
          <Topbar user={mockUser} notifications={3} />
          <MainContainer>
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          </MainContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employee" />
      <div className="flex-1 flex flex-col">
        <Topbar user={mockUser} notifications={3} />
        <MainContainer>
          <div className="mb-6">
            <Typography variant="h4" className="text-gray-900 font-semibold mb-2">
              My Feedback
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              View and manage feedback received from your managers
            </Typography>
          </div>

          {/* Feedback Stats */}
          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent className="text-center">
                  <Typography variant="h4" className="text-blue-600 font-bold">
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Total Feedback
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent className="text-center">
                  <Typography variant="h4" className="text-green-600 font-bold">
                    {stats.acknowledged}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Acknowledged
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card elevation={1}>
                <CardContent className="text-center">
                  <Typography variant="h4" className="text-orange-600 font-bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Feedback List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feedback Cards */}
            <div className="lg:col-span-1">
              <Typography variant="h6" className="text-gray-800 font-semibold mb-4">
                Feedback Received ({feedbackList.length})
              </Typography>
              
              {feedbackList.length === 0 ? (
                <Paper elevation={1} className="p-8 text-center">
                  <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
                  <Typography variant="h6" className="text-gray-600 mb-2">
                    No Feedback Yet
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    You haven't received any feedback from your managers yet.
                  </Typography>
                </Paper>
              ) : (
                <div className="space-y-4">
                  {feedbackList.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <FeedbackCard
                        avatar=""
                        name={feedback.manager_name || `Manager #${feedback.manager_id}`}
                        role="Manager"
                        date={formatDate(feedback.created_at)}
                        sentiment={feedback.sentiment}
                        sentimentLabel={getSentimentLabel(feedback.sentiment)}
                        summary=""
                        strengths={feedback.strengths ? [feedback.strengths] : []}
                        improvements={feedback.areas_to_improve ? [feedback.areas_to_improve] : []}
                        tags={feedback.tags || []}
                        commentsCount={feedback.comments_count || 0}
                        acknowledged={feedback.acknowledged}
                        onAcknowledge={() => handleAcknowledge(feedback.id)}
                        onComment={() => handleComment(feedback)}
                        onEdit={() => handleEdit(feedback)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Panel */}
            <div className="lg:col-span-1">
              {showComments && selectedFeedback ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper elevation={2} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h6" className="text-gray-800 font-semibold">
                        Comments for Feedback
                      </Typography>
                      <Button
                        size="small"
                        onClick={handleCloseComments}
                        className="text-gray-500"
                      >
                        <i className="ri-close-line mr-1"></i>
                        Close
                      </Button>
                    </div>
                    
                    <Divider className="mb-4" />
                    
                    <Comments feedbackId={selectedFeedback.id} />
                  </Paper>
                </motion.div>
              ) : (
                <Paper elevation={1} className="p-8 text-center">
                  <i className="ri-message-2-line text-4xl text-gray-400 mb-4"></i>
                  <Typography variant="h6" className="text-gray-600 mb-2">
                    No Feedback Selected
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Click on a feedback card to view comments and add your thoughts.
                  </Typography>
                </Paper>
              )}
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 