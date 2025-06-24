import React from 'react';
import { motion } from 'framer-motion';
import { Chip } from '@mui/material';

const statusColors = {
  pending: 'warning',
  completed: 'success',
  rejected: 'error',
  inprogress: 'info',
  approved: 'success',
};

const statusIcons = {
  pending: 'ri-time-line',
  completed: 'ri-check-line',
  rejected: 'ri-close-line',
  inprogress: 'ri-loader-line',
  approved: 'ri-check-line',
};

export default function PendingRequestCard({ request }) {
  // Handle both old mock data format and new API data format
  const title = request.title || request.message || 'Feedback Request';
  const status = request.status || 'pending';
  const managerName = request.managerName || request.target_name || `Manager #${request.target_id}` || 'Unknown Manager';
  const date = request.date || (request.created_at ? new Date(request.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : 'Unknown Date');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="mb-3"
    >
      <div className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1 truncate">
              {title.length > 50 ? `${title.substring(0, 50)}...` : title}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2">
              {request.message && request.message.length > 80 ? `${request.message.substring(0, 80)}...` : request.message}
            </p>
          </div>
          <Chip
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            color={statusColors[status] || 'default'}
            size="small"
            icon={<i className={statusIcons[status] || 'ri-question-line'}></i>}
            className="ml-2 flex-shrink-0"
          />
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-user-line text-gray-400"></i>
          </div>
          <span className="truncate">{managerName}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-4 h-4 flex items-center justify-center mr-2">
            <i className="ri-calendar-line text-gray-400"></i>
          </div>
          <span>Requested on {date}</span>
        </div>

        {/* Show feedback if completed */}
        {status === 'completed' && request.feedback && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <p className="text-xs text-green-800 font-medium mb-1">Feedback Received:</p>
            <p className="text-xs text-green-700 line-clamp-2">
              {request.feedback.length > 100 ? `${request.feedback.substring(0, 100)}...` : request.feedback}
            </p>
          </div>
        )}

        {/* Show rejection reason if rejected */}
        {status === 'rejected' && request.rejection_reason && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-800 font-medium mb-1">Reason for Rejection:</p>
            <p className="text-xs text-red-700 line-clamp-2">
              {request.rejection_reason.length > 100 ? `${request.rejection_reason.substring(0, 100)}...` : request.rejection_reason}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 