import React from 'react';
import { motion } from 'framer-motion';

export default function FeedbackCard({
  avatar, name, role, date, sentiment, sentimentLabel, summary, strengths = [], improvements = [], tags = [], commentsCount = 0, acknowledged, onAcknowledge, onComment, onEdit
}) {
  const sentimentColors = {
    positive: 'bg-green-100 text-green-600',
    neutral: 'bg-yellow-100 text-yellow-600',
    negative: 'bg-red-100 text-red-600',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium">
              {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" /> : name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-sm text-gray-500">{role} • {date}</div>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${sentimentColors[sentiment]}`}> 
            <i className={
              sentiment === 'positive' ? 'ri-emotion-happy-line' :
              sentiment === 'neutral' ? 'ri-emotion-normal-line' :
              'ri-emotion-unhappy-line'
            }></i>
            <span>{sentimentLabel}</span>
          </div>

        </div>
        <div className="mt-4">
          <div className="mb-3">
            <div className="text-sm font-medium text-gray-700 mb-1">Strengths</div>
            <p className="text-sm text-gray-600">{strengths.join(', ')}</p>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Areas to Improve</div>
            <p className="text-sm text-gray-600">{improvements.join(', ')}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">{tag}</span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" onClick={onComment}>
              <i className="ri-message-2-line"></i>
              <span>Comment ({commentsCount})</span>
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" onClick={onEdit}>
              <i className="ri-edit-line"></i>
              <span>Edit</span>
            </button>
          </div>
          <div>
            {acknowledged ? (
              <span className="text-xs text-gray-500">Acknowledged</span>
            ) : (
              <button className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium hover:bg-primary/20 whitespace-nowrap" onClick={onAcknowledge}>Awaiting Acknowledgment</button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
