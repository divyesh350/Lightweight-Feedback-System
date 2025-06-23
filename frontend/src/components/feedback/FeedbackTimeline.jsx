import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCommentsStore } from '../../store/useCommentsStore';

export default function FeedbackTimeline({ feedbackList = [], onAcknowledge }) {
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentValue, setCommentValue] = useState('');
  const [sending, setSending] = useState(false);

  const { createComment } = useCommentsStore();

  const handleSendComment = async (feedbackId) => {
    if (!commentValue.trim()) return;
    setSending(true);
    try {
      await createComment(feedbackId, commentValue.trim());
      setCommentValue('');
      setActiveCommentId(null); // or keep open if you want
    } catch (e) {
      // Optionally show error
    }
    setSending(false);
  };

  return (
    <div className="relative">
      <div className="timeline-line absolute top-6 bottom-0 left-4 w-1 bg-gray-200 z-0" />
      <div className="space-y-8">
        {feedbackList.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative pl-12"
          >
            <div className={`timeline-dot absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
              item.sentiment === 'positive' ? 'bg-green-100 text-green-600' :
              item.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <i className={
                item.sentiment === 'positive' ? 'ri-thumb-up-line' :
                item.sentiment === 'neutral' ? 'ri-arrow-right-line' :
                'ri-error-warning-line'
              }></i>
            </div>
            <div className="feedback-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                  {/* Optionally display manager_id or other info if available */}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  item.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                </span>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
                <p className="text-sm text-gray-700">{item.strengths}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Areas to Improve</h4>
                <p className="text-sm text-gray-700">{item.areas_to_improve}</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  {!item.acknowledged ? (
                    <button
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md whitespace-nowrap"
                      onClick={() => onAcknowledge(item.id)}
                    >
                      Acknowledge Feedback
                    </button>
                  ) : (
                    <span className="text-xs text-green-600 font-medium flex items-center">
                      <div className="w-4 h-4 flex items-center justify-center mr-1">
                        <i className="ri-check-line"></i>
                      </div>
                      Acknowledged
                    </span>
                  )}
                </div>
                <button
                  className="px-3 py-1.5 bg-white text-primary text-sm font-medium border border-primary rounded whitespace-nowrap"
                  onClick={() => setActiveCommentId(item.id)}
                >
                  Add Comment
                </button>
              </div>
              {/* Inline comment input */}
              {activeCommentId === item.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded"
                    placeholder="Write a comment..."
                    value={commentValue}
                    onChange={e => setCommentValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendComment(item.id);
                    }}
                    disabled={sending}
                  />
                  <button
                    className="px-3 py-1 bg-primary text-white rounded disabled:opacity-50"
                    onClick={() => handleSendComment(item.id)}
                    disabled={sending || !commentValue.trim()}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    className="px-2 py-1 text-gray-400 hover:text-gray-700"
                    onClick={() => setActiveCommentId(null)}
                    disabled={sending}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 