import React from 'react';

export default function DashboardHeader({
  title = '',
  date = '',
  onExport = () => {},
  onNewFeedback = () => {},
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{date}</p>
      </div>
      <div className="mt-4 md:mt-0 flex gap-3">
        <button
          className="px-4 py-2 bg-white border border-gray-200 rounded-button text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap rounded-md"
          onClick={onExport}
        >
          <i className="ri-download-line"></i>
          <span>Export</span>
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-button text-sm font-medium hover:bg-blue-600 flex items-center gap-2 whitespace-nowrap rounded-md"
          onClick={onNewFeedback}
        >
          <i className="ri-add-line"></i>
          <span>New Feedback</span>
        </button>
      </div>
    </div>
  );
} 