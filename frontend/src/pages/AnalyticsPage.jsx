import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import DashboardHeader from '../components/layout/DashboardHeader';
import SentimentTrendsChart from '../components/analytics/SentimentTrendsChart';
import EmployeePerformanceChart from '../components/analytics/EmployeePerformanceChart';
import FeedbackDistributionChart from '../components/analytics/FeedbackDistributionChart';
import AnalyticsInsights from '../components/analytics/AnalyticsInsights';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import { useManagerDashboardStore } from '../store/useManagerDashboardStore';
import { useAuthStore } from '../store/useAuthStore';

function getToday() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState('3months');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedChartType, setSelectedChartType] = useState('sentiment');
  
  const {
    overview,
    sentimentTrends,
    recentFeedback,
    teamMembers,
    loading,
    error,
    loadOverview,
    loadSentimentTrends,
    loadRecentFeedback,
    loadTeamMembers,
    clearError,
  } = useManagerDashboardStore();

  // Load data on component mount
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        await Promise.all([
          loadOverview(),
          loadSentimentTrends(),
          loadRecentFeedback(),
          loadTeamMembers(),
        ]);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      }
    };
    
    loadAnalyticsData();
  }, [loadOverview, loadSentimentTrends, loadRecentFeedback, loadTeamMembers]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleRefresh = async () => {
    try {
      await Promise.all([
        loadOverview(),
        loadSentimentTrends(),
        loadRecentFeedback(),
        loadTeamMembers(),
      ]);
      toast.success('Analytics data refreshed!');
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
      toast.error('Failed to refresh analytics data');
    }
  };

  const handleTimeRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
    // In a real implementation, you would refetch data based on the time range
  };

  const handleEmployeeChange = (employeeId) => {
    setSelectedEmployee(employeeId);
    // In a real implementation, you would filter data based on the employee
  };

  const handleChartTypeChange = (chartType) => {
    setSelectedChartType(chartType);
  };

  // Calculate analytics insights
  const calculateInsights = () => {
    if (!recentFeedback || !overview) return null;

    try {
      const totalFeedback = recentFeedback.length || 0;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Filter feedback for current month
      const currentMonthFeedback = recentFeedback.filter(fb => {
        if (!fb.created_at) return false;
        const feedbackDate = new Date(fb.created_at);
        return feedbackDate.getMonth() === currentMonth && feedbackDate.getFullYear() === currentYear;
      });

      const avgFeedbackPerMonth = totalFeedback > 0 ? (totalFeedback / 3).toFixed(1) : 0; // Assuming 3 months of data
      const positivePercentage = overview.positive_percentage || 0;
      const acknowledgmentRate = totalFeedback > 0 ? 
        (recentFeedback.filter(fb => fb.acknowledged).length / totalFeedback * 100).toFixed(1) : 0;

      return {
        totalFeedback,
        currentMonthFeedback: currentMonthFeedback.length,
        avgFeedbackPerMonth,
        positivePercentage,
        acknowledgmentRate,
        teamSize: teamMembers?.length || 0,
      };
    } catch (error) {
      console.error('Error calculating insights:', error);
      return {
        totalFeedback: 0,
        currentMonthFeedback: 0,
        avgFeedbackPerMonth: 0,
        positivePercentage: 0,
        acknowledgmentRate: 0,
        teamSize: teamMembers?.length || 0,
      };
    }
  };

  const insights = calculateInsights();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar notifications={3} />
        <MainContainer>
          <DashboardHeader
            title="Analytics Dashboard"
            date={getToday()}
            onRefresh={handleRefresh}
            loading={loading.overview || loading.trends || loading.feedback}
          />

          {/* Analytics Filters */}
          <AnalyticsFilters
            timeRange={selectedTimeRange}
            employee={selectedEmployee}
            chartType={selectedChartType}
            teamMembers={teamMembers}
            onTimeRangeChange={handleTimeRangeChange}
            onEmployeeChange={handleEmployeeChange}
            onChartTypeChange={handleChartTypeChange}
          />

          {/* Analytics Insights */}
          {insights && (
            <AnalyticsInsights insights={insights} loading={loading.overview} />
          )}

          {/* Charts Section */}
          <div className="space-y-6">
            {/* Sentiment Trends Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Sentiment Trends</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Time Range:</span>
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => handleTimeRangeChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1month">1 Month</option>
                    <option value="3months">3 Months</option>
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                  </select>
                </div>
              </div>
              <SentimentTrendsChart 
                data={sentimentTrends} 
                loading={loading.trends}
                timeRange={selectedTimeRange}
              />
            </div>

            {/* Employee Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Employee Performance</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Employee:</span>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Employees</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <EmployeePerformanceChart 
                data={recentFeedback}
                teamMembers={teamMembers}
                selectedEmployee={selectedEmployee}
                loading={loading.feedback}
              />
            </div>

            {/* Feedback Distribution Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Feedback Distribution</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Chart Type:</span>
                  <select
                    value={selectedChartType}
                    onChange={(e) => handleChartTypeChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="sentiment">By Sentiment</option>
                    <option value="employee">By Employee</option>
                    <option value="month">By Month</option>
                  </select>
                </div>
              </div>
              <FeedbackDistributionChart 
                data={recentFeedback}
                chartType={selectedChartType}
                loading={loading.feedback}
              />
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 