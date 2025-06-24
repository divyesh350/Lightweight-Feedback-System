import React from 'react';
import PeerFeedbackCard from './PeerFeedbackCard';
import { Typography, Paper } from '@mui/material';

export default function PeerFeedbackList({ feedbackList = [], type = 'given' }) {
  if (!feedbackList || feedbackList.length === 0) {
    return (
      <Paper elevation={1} className="p-8 text-center">
        <i className="ri-inbox-line text-4xl text-gray-400 mb-4"></i>
        <Typography variant="h6" className="text-gray-600 mb-2">
          No Peer Feedback {type === 'given' ? 'Given' : 'Received'}
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          {type === 'given'
            ? "You haven't given any peer feedback yet."
            : "You haven't received any peer feedback yet."}
        </Typography>
      </Paper>
    );
  }

  return (
    <div className="space-y-4">
      {feedbackList.map((feedback) => (
        <PeerFeedbackCard key={feedback.id} feedback={feedback} type={type} />
      ))}
    </div>
  );
} 