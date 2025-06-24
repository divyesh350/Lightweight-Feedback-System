import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import Comments from './Comments';

const sentimentColors = {
  positive: 'bg-green-100 text-green-600',
  neutral: 'bg-yellow-100 text-yellow-600',
  negative: 'bg-red-100 text-red-600',
};

export default function PeerFeedbackCard({ feedback, type }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Determine display name
  let displayName = '';
  if (type === 'given') {
    displayName = feedback.to_user_name || `User #${feedback.to_user_id}`;
  } else {
    displayName = feedback.is_anonymous ? 'Anonymous' : (feedback.from_user_name || `User #${feedback.from_user_id}`);
  }

  return (
    <Card elevation={2} className="rounded-lg">
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Typography variant="subtitle2" className="text-gray-700">
            {type === 'given' ? 'To:' : 'From:'} <span className="font-semibold">{displayName}</span>
          </Typography>
          <Chip
            label={getSentimentLabel(feedback.sentiment)}
            className={sentimentColors[feedback.sentiment] + ' text-xs'}
            size="small"
          />
        </div>
        <Typography variant="caption" className="text-gray-500 mb-2 block">
          {formatDate(feedback.created_at)}
        </Typography>
        <div className="mb-2">
          <Typography variant="body2" className="font-medium text-gray-800 mb-1">Strengths</Typography>
          <Typography variant="body2" className="text-gray-700 bg-green-50 p-2 rounded">
            {feedback.strengths}
          </Typography>
        </div>
        <div className="mb-2">
          <Typography variant="body2" className="font-medium text-gray-800 mb-1">Areas to Improve</Typography>
          <Typography variant="body2" className="text-gray-700 bg-yellow-50 p-2 rounded">
            {feedback.areas_to_improve}
          </Typography>
        </div>
        {/* Comments Section (optional) */}
        {feedback.id && (
          <div className="mt-3">
            <Comments feedbackId={feedback.id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
} 