import React from 'react';
import { motion } from 'framer-motion';

export default function FeedbackDistributionChart({ data, chartType, loading }) {
  // Process data based on chart type
  const processChartData = () => {
    if (!data) return { labels: [], datasets: [] };

    switch (chartType) {
      case 'sentiment':
        return processSentimentData();
      case 'employee':
        return processEmployeeData();
      case 'month':
        return processMonthlyData();
      default:
        return processSentimentData();
    }
  };

  const processSentimentData = () => {
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    data.forEach(feedback => {
      sentimentCounts[feedback.sentiment] = (sentimentCounts[feedback.sentiment] || 0) + 1;
    });

    return {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderColor: ['#059669', '#D97706', '#DC2626'],
        borderWidth: 2,
      }],
    };
  };

  const processEmployeeData = () => {
    const employeeCounts = {};
    
    data.forEach(feedback => {
      const employeeName = feedback.employee_name || `Employee ${feedback.employee_id}`;
      employeeCounts[employeeName] = (employeeCounts[employeeName] || 0) + 1;
    });

    const labels = Object.keys(employeeCounts);
    const values = Object.values(employeeCounts);
    const colors = generateColors(labels.length);

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      }],
    };
  };

  const processMonthlyData = () => {
    const monthlyCounts = {};
    
    data.forEach(feedback => {
      const date = new Date(feedback.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthlyCounts).sort();
    const labels = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const values = sortedMonths.map(month => monthlyCounts[month]);

    return {
      labels,
      datasets: [{
        label: 'Feedback Count',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
        tension: 0.4,
      }],
    };
  };

  const generateColors = (count) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    ];
    
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const chartData = processChartData();

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

  if (!data || data.length === 0) {
    return (
      <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <i className="ri-pie-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No distribution data available</p>
        </div>
      </div>
    );
  }

  const total = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Chart Title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Feedback Distribution - {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
        </h3>
        <p className="text-sm text-gray-500">Total: {total} feedback items</p>
      </div>

      {/* Chart Visualization */}
      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Chart Area */}
        <div className="flex-1 w-full">
          {chartType === 'month' ? (
            // Line chart for monthly data
            <div className="h-64 bg-gray-50 rounded-lg p-4">
              <div className="relative h-full">
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                  <span>{Math.max(...chartData.datasets[0].data)}</span>
                  <span>{Math.max(...chartData.datasets[0].data) * 0.75}</span>
                  <span>{Math.max(...chartData.datasets[0].data) * 0.5}</span>
                  <span>{Math.max(...chartData.datasets[0].data) * 0.25}</span>
                  <span>0</span>
                </div>

                {/* Chart lines */}
                <div className="ml-8 h-full flex items-end space-x-2">
                  {chartData.datasets[0].data.map((value, index) => {
                    const maxValue = Math.max(...chartData.datasets[0].data);
                    const height = (value / maxValue) * 100;
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">{chartData.labels[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Pie chart for sentiment and employee data
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {chartData.datasets[0].data.map((value, index) => {
                  const percentage = (value / total) * 100;
                  const rotation = chartData.datasets[0].data
                    .slice(0, index)
                    .reduce((sum, val) => sum + (val / total) * 360, 0);
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          background: `conic-gradient(${chartData.datasets[0].backgroundColor[index]} 0deg ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                        }}
                      />
                    </div>
                  );
                })}
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="w-full lg:w-64">
          <h4 className="font-medium text-gray-900 mb-3">Distribution Details</h4>
          <div className="space-y-2">
            {chartData.labels.map((label, index) => {
              const value = chartData.datasets[0].data[index];
              const percentage = ((value / total) * 100).toFixed(1);
              
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-bar-chart-line text-sm"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-lg font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-pie-chart-line text-sm"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-lg font-bold text-gray-900">{chartData.labels.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center">
              <i className="ri-trending-up-line text-sm"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. per Category</p>
              <p className="text-lg font-bold text-gray-900">
                {(total / chartData.labels.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 