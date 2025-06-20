import React from 'react';
import { motion } from 'framer-motion';

const sentimentColors = {
  positive: 'text-green-500 bg-green-100',
  neutral: 'text-yellow-500 bg-yellow-100',
  negative: 'text-red-500 bg-red-100',
};

export default function TeamMemberCard({ avatar, name, role, sentiment, sentimentLabel, sentimentValue, reviews }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium ${sentimentColors[sentiment] || 'bg-gray-100 text-gray-500'}`}>{avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" /> : name?.split(' ').map(n => n[0]).join('')}</div>
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1 text-xs ${sentimentColors[sentiment]}`}> 
            <i className={
              sentiment === 'positive' ? 'ri-emotion-happy-line' :
              sentiment === 'neutral' ? 'ri-emotion-normal-line' :
              'ri-emotion-unhappy-line'
            }></i>
            <span>{sentimentValue}</span>
          </div>
          <div className="text-xs text-gray-500">{reviews} reviews</div>
        </div>
      </div>
    </motion.div>
  );
} 