import React from 'react';
import SentimentDonutChart from '../charts/SentimentDonutChart';
import FeedbackTrendChart from '../charts/FeedbackTrendChart';

const DashboardCharts = ({ sentimentData, trendData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Ensure data is arrays
  const safeSentimentData = Array.isArray(sentimentData) ? sentimentData : [];
  const safeTrendData = Array.isArray(trendData) ? trendData : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Sentiment Overview</h2>
        <SentimentDonutChart data={safeSentimentData} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Feedback Trends</h2>
        <FeedbackTrendChart data={safeTrendData} />
      </div>
    </div>
  );
};

export default DashboardCharts; 