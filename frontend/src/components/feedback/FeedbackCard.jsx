import React from 'react';
import { motion } from 'framer-motion';
import { Chip, Badge } from '@mui/material';

export default function FeedbackCard({
  avatar, name, role, date, sentiment, sentimentLabel, summary, strengths = [], improvements = [], tags = [], commentsCount = 0, acknowledged, onAcknowledge, onComment, onEdit , isManager = false
}) {
  const sentimentColors = {
    positive: 'bg-green-100 text-green-600',
    neutral: 'bg-yellow-100 text-yellow-600',
    negative: 'bg-red-100 text-red-600',
  };
  if(role === 'manager'){
    isManager = true;
  }
  else{
    isManager = false;
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
            {isManager ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <i className="ri-message-2-line text-lg text-gray-400"></i>
                  {commentsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {commentsCount > 99 ? '99+' : commentsCount}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {commentsCount === 0 ? 'No comments' : 
                   commentsCount === 1 ? '1 comment' : 
                   `${commentsCount} comments`}
                </span>
              </div>
            ) : (
              <button 
                className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors" 
                onClick={onComment}
              >
                <div className="relative">
                  <i className="ri-message-2-line text-lg"></i>
                  {commentsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {commentsCount > 99 ? '99+' : commentsCount}
                    </span>
                  )}
                </div>
                <span className="font-medium">
                  {commentsCount === 0 ? 'Add Comment' : 
                   commentsCount === 1 ? '1 Comment' : 
                   `${commentsCount} Comments`}
                </span>
              </button>
            )}
            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1" onClick={onEdit}>
              <i className="ri-edit-line"></i>
              <span>Edit</span>
            </button>
          </div>
          <div>
            {acknowledged ? (
              <Chip 
                label="Acknowledged" 
                size="small" 
                color="success" 
                variant="outlined"
                icon={<i className="ri-check-line"></i>}
              />
            ) : (
              <button 
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium hover:bg-primary/20 whitespace-nowrap transition-colors" 
                onClick={onAcknowledge}
              >
                Awaiting Acknowledgment
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
