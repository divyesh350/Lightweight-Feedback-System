import React from 'react';
import { motion } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  inprogress: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
};

export default function PendingRequestCard({ title, status, managerName, date }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="p-3 border border-gray-200 rounded bg-gray-50 mb-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium">{title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            <i className="ri-user-line"></i>
          </div>
          <span>{managerName}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-4 h-4 flex items-center justify-center mr-1">
            <i className="ri-calendar-line"></i>
          </div>
          <span>Requested on {date}</span>
        </div>
      </div>
    </motion.div>
  );
} 