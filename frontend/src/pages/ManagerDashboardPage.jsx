import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import DashboardHeader from '../components/layout/DashboardHeader';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import TeamMembersSection from '../components/team/TeamMembersSection';
import RecentFeedbackSection from '../components/feedback/RecentFeedbackSection';
import TeamManagementModal from '../components/modals/TeamManagementModal';
import FeedbackFormModal from '../components/modals/FeedbackFormModal';
import { useManagerDashboardStore } from '../store/useManagerDashboardStore';
import { useAuthStore } from '../store/useAuthStore';
import { useDashboardRefresh } from '../hooks/useDashboardRefresh';

function getToday() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ManagerDashboardPage() {
  const navigate = useNavigate();
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const { role } = useAuthStore();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const {
    sentimentTrends,
    teamMembers,
    recentFeedback,
    loading,
    error,
    loadAllDashboardData,
    getDashboardStats,
    getSentimentData,
    clearError,
  } = useManagerDashboardStore();

  // Memoize the refresh function to prevent unnecessary re-renders
  const refreshDashboard = useCallback(() => {
    loadAllDashboardData();
  }, [loadAllDashboardData]);

  // Set up auto-refresh (every 30 seconds)
  const { manualRefresh } = useDashboardRefresh(refreshDashboard, 30000);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Get computed data
  const dashboardStats = getDashboardStats();
  const sentimentData = getSentimentData();

  // Transform trend data for charts
  const transformTrendData = () => {
    // Check if sentimentTrends is an array and has data
    if (!sentimentTrends || !Array.isArray(sentimentTrends) || sentimentTrends.length === 0) {
      return [
        { name: 'Week 1', Positive: 25, Neutral: 8, Negative: 5 },
        { name: 'Week 2', Positive: 32, Neutral: 10, Negative: 4 },
        { name: 'Week 3', Positive: 35, Neutral: 6, Negative: 3 },
        { name: 'Week 4', Positive: 38, Neutral: 8, Negative: 2 },
      ];
    }

    return sentimentTrends.map(trend => ({
      name: trend.month || trend.period || 'Unknown',
      Positive: trend.positive || 0,
      Neutral: trend.neutral || 0,
      Negative: trend.negative || 0,
    }));
  };


  const handleNewFeedback = () => {
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    // Refresh dashboard data after successful feedback creation
    refreshDashboard();
  };

  const handleViewAllTeam = () => {
    navigate('/team');
  };

  const handleViewAllFeedback = () => {
    navigate('/manager/feedback');
  };

  const handleRefresh = () => {
    manualRefresh();
    toast.success('Dashboard refreshed!');
  };

  const handleTeamManagement = () => {
    setTeamModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar notifications={3} />
        <MainContainer>
          <DashboardHeader
            title="Manager Dashboard"
            date={getToday()}
            onNewFeedback={handleNewFeedback}
            onRefresh={handleRefresh}
            onTeamManagement={handleTeamManagement}
            loading={Object.values(loading).some(Boolean)}
          />
          
          {/* Stats Cards */}
          <DashboardStats 
            stats={dashboardStats} 
            loading={loading.overview} 
          />
          
          {/* Charts Row */}
          <DashboardCharts 
            sentimentData={sentimentData}
            trendData={transformTrendData()}
            loading={loading.trends}
          />
          
          {/* Team Members Section */}
          <TeamMembersSection 
            teamMembers={teamMembers}
            loading={loading.team}
            onViewAll={handleViewAllTeam}
          />
          
          {/* Recent Feedback Section */}
          <RecentFeedbackSection 
            feedback={recentFeedback}
            role={role}
            loading={loading.feedback}
            onViewAll={handleViewAllFeedback}
          />
        </MainContainer>
      </div>

      {/* Team Management Modal */}
      <TeamManagementModal 
        open={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
      />

      {/* Feedback Form Modal */}
      <FeedbackFormModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
} 