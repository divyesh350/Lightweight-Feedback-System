import React from 'react';
import { motion } from 'framer-motion';

export default function SentimentTrendsChart({ data, loading, timeRange }) {
  // Mock data for demonstration - in real app, this would come from the API
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Positive',
        data: [65, 72, 68, 75, 80, 78],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Neutral',
        data: [25, 20, 22, 18, 15, 17],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Negative',
        data: [10, 8, 10, 7, 5, 5],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Process API data if it exists and has the expected structure
  const processApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return null;
    }

    // Check if the data has the expected structure
    const firstItem = apiData[0];
    if (!firstItem || typeof firstItem !== 'object') {
      return null;
    }

    // Try to extract data based on different possible structures
    let labels = [];
    let positiveData = [];
    let neutralData = [];
    let negativeData = [];

    // Structure 1: Array of objects with month/period and sentiment counts
    if (firstItem.month || firstItem.period) {
      labels = apiData.map(item => item.month || item.period || 'Unknown');
      positiveData = apiData.map(item => item.positive || 0);
      neutralData = apiData.map(item => item.neutral || 0);
      negativeData = apiData.map(item => item.negative || 0);
    }
    // Structure 2: Array of objects with date and sentiment
    else if (firstItem.date || firstItem.created_at) {
      // Group by month and count sentiments
      const monthlyData = {};
      apiData.forEach(item => {
        const date = new Date(item.date || item.created_at);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { positive: 0, neutral: 0, negative: 0 };
        }
        
        const sentiment = item.sentiment || 'neutral';
        monthlyData[monthKey][sentiment]++;
      });

      labels = Object.keys(monthlyData);
      positiveData = labels.map(month => monthlyData[month].positive);
      neutralData = labels.map(month => monthlyData[month].neutral);
      negativeData = labels.map(month => monthlyData[month].negative);
    }
    // If structure is unknown, return null to use mock data
    else {
      return null;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Positive',
          data: positiveData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Neutral',
          data: neutralData,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Negative',
          data: negativeData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  // Use processed API data or fall back to mock data
  const processedData = processApiData(data);
  const chartData = processedData || mockData;

  if (loading) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Safety check for chart data structure
  if (!chartData || !chartData.datasets || !Array.isArray(chartData.datasets) || chartData.datasets.length === 0) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <i className="ri-bar-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No sentiment data available</p>
        </div>
      </div>
    );
  }

  // Ensure all datasets have data arrays
  const validDatasets = chartData.datasets.filter(dataset => 
    dataset && dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0
  );

  if (validDatasets.length === 0) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <i className="ri-bar-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No valid sentiment data available</p>
        </div>
      </div>
    );
  }

  // Simple chart implementation using CSS
  const maxValue = Math.max(...validDatasets.flatMap(dataset => dataset.data));
  const chartHeight = 300;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Chart Container */}
      <div className="h-80 bg-gray-50 rounded-lg p-6">
        {/* Chart Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sentiment Trends Over Time</h3>
          <p className="text-sm text-gray-500">Showing data for {timeRange}</p>
        </div>

        {/* Chart Area */}
        <div className="relative h-48 mb-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>

          {/* Chart lines */}
          <div className="ml-8 h-full flex items-end space-x-4">
            {chartData.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                {/* Chart bars for each sentiment */}
                <div className="w-full flex flex-col space-y-1">
                  {validDatasets.map((dataset, datasetIndex) => {
                    const percentage = (dataset.data[index] / maxValue) * 100;
                    const height = (percentage / 100) * (chartHeight * 0.6);
                    
                    return (
                      <div
                        key={datasetIndex}
                        className="relative"
                        style={{ height: `${height}px` }}
                      >
                        <div
                          className="w-full rounded-t"
                          style={{
                            backgroundColor: dataset.backgroundColor,
                            borderTop: `2px solid ${dataset.borderColor}`,
                            height: '100%',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {/* X-axis label */}
                <span className="text-xs text-gray-500 mt-2">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6">
          {validDatasets.map((dataset, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: dataset.borderColor }}
              />
              <span className="text-sm text-gray-700">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {validDatasets.map((dataset, index) => {
          const latestValue = dataset.data[dataset.data.length - 1];
          const previousValue = dataset.data[dataset.data.length - 2] || latestValue;
          const change = latestValue - previousValue;
          const changePercent = previousValue > 0 ? ((change / previousValue) * 100).toFixed(1) : 0;
          
          return (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{dataset.label}</p>
                  <p className="text-xl font-bold text-gray-900">{latestValue}</p>
                </div>
                <div className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{changePercent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
} 