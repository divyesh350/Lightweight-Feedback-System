import React from 'react';
import { motion } from 'framer-motion';

export default function FeedbackTimeline({ feedbackList = [] }) {
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
            <div className={`timeline-dot absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${item.sentiment === 'positive' ? 'bg-green-100 text-green-600' : item.sentiment === 'mixed' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
              <i className={
                item.sentiment === 'positive' ? 'ri-thumb-up-line' :
                item.sentiment === 'mixed' ? 'ri-arrow-right-line' :
                'ri-error-warning-line'
              }></i>
            </div>
            <div className="feedback-card bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <div className="flex items-center mt-1">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                      <img src={item.managerAvatar} alt="Manager Avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium">{item.managerName}</span>
                    <span className="text-xs text-gray-500 ml-2">{item.managerRole}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.sentiment === 'positive' ? 'bg-green-100 text-green-800' : item.sentiment === 'mixed' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{item.sentimentLabel}</span>
              </div>
              <p className="text-gray-700 text-sm mb-4">{item.summary}</p>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
                <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
                  {item.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Areas to Improve</h4>
                <ul className="text-sm text-gray-700 space-y-1 pl-5 list-disc">
                  {item.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="flex justify-between items-center">
                {item.acknowledged ? (
                  <span className="text-xs text-green-600 font-medium flex items-center">
                    <div className="w-4 h-4 flex items-center justify-center mr-1">
                      <i className="ri-check-line"></i>
                    </div>
                    Acknowledged
                  </span>
                ) : (
                  <button className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded !rounded-button whitespace-nowrap">Acknowledge Feedback</button>
                )}
                <button className="px-3 py-1.5 bg-white text-primary text-sm font-medium border border-primary rounded !rounded-button whitespace-nowrap">Add Comment</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 