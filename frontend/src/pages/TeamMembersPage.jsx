import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import DashboardHeader from '../components/layout/DashboardHeader';
import TeamMemberCard from '../components/team/TeamMemberCard';
import TeamStatsOverview from '../components/team/TeamStatsOverview';
import TeamMemberModal from '../components/modals/TeamMemberModal';
import { useTeamStore } from '../store/useTeamStore';
import { useManagerDashboardStore } from '../store/useManagerDashboardStore';
import { useAuthStore } from '../store/useAuthStore';

function getToday() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function TeamMembersPage() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { user } = useAuthStore();
  
  const {
    teamMembers,
    loading: teamLoading,
    error: teamError,
    loadTeamMembers,
    clearError: clearTeamError,
  } = useTeamStore();

  const {
    overview,
    recentFeedback,
    loading: dashboardLoading,
    error: dashboardError,
    loadOverview,
    loadRecentFeedback,
    clearError: clearDashboardError,
  } = useManagerDashboardStore();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadTeamMembers(),
          loadOverview(),
          loadRecentFeedback(),
        ]);
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };
    
    loadData();
  }, [loadTeamMembers, loadOverview, loadRecentFeedback]);

  // Handle errors
  useEffect(() => {
    if (teamError) {
      toast.error(teamError);
      clearTeamError();
    }
    if (dashboardError) {
      toast.error(dashboardError);
      clearDashboardError();
    }
  }, [teamError, dashboardError, clearTeamError, clearDashboardError]);

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setMemberModalOpen(true);
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([
        loadTeamMembers(),
        loadOverview(),
        loadRecentFeedback(),
      ]);
      toast.success('Team data refreshed!');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
  };

  const handleNewFeedback = () => {
    navigate('/manager/feedback');
  };

  const handleTeamManagement = () => {
    navigate('/dashboard/manager');
  };

  // Calculate team stats
  const teamStats = {
    totalMembers: teamMembers?.length || 0,
    activeMembers: teamMembers?.filter(member => member.role === 'employee').length || 0,
    totalFeedback: overview?.total_feedback || 0,
    averageSentiment: overview?.positive_percentage || 0,
  };

  // Get feedback count for each team member
  const getMemberFeedbackCount = (memberId) => {
    if (!recentFeedback || !Array.isArray(recentFeedback)) return 0;
    return recentFeedback.filter(feedback => feedback.employee_id === memberId).length;
  };

  // Get progress badge based on feedback count and sentiment
  const getProgressBadge = (memberId) => {
    const feedbackCount = getMemberFeedbackCount(memberId);
    const memberFeedback = recentFeedback?.filter(fb => fb.employee_id === memberId) || [];
    const positiveCount = memberFeedback.filter(fb => fb.sentiment === 'positive').length;
    const positivePercentage = feedbackCount > 0 ? (positiveCount / feedbackCount) * 100 : 0;
    
    if (feedbackCount >= 5 && positivePercentage >= 80) return { type: 'excellent', label: 'Excellent', color: 'green' };
    if (feedbackCount >= 3 && positivePercentage >= 60) return { type: 'good', label: 'Good', color: 'blue' };
    if (feedbackCount >= 1 && positivePercentage >= 40) return { type: 'average', label: 'Average', color: 'yellow' };
    if (feedbackCount === 0) return { type: 'no-feedback', label: 'No Feedback', color: 'gray' };
    return { type: 'needs-improvement', label: 'Needs Improvement', color: 'red' };
  };

  // Check if any data is still loading
  const isLoading = teamLoading.team || dashboardLoading.overview || dashboardLoading.feedback;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar notifications={3} />
        <MainContainer>
          <DashboardHeader
            title="Team Members"
            date={getToday()}
            onNewFeedback={handleNewFeedback}
            onRefresh={handleRefresh}
            onTeamManagement={handleTeamManagement}
            loading={isLoading}
          />

          {/* Team Stats Overview */}
          <TeamStatsOverview stats={teamStats} loading={dashboardLoading.overview} />

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Direct Reports</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <i className="ri-list-check"></i>
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeleton
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !teamMembers || teamMembers.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <i className="ri-team-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Team Members</h3>
                <p className="text-gray-500 mb-6">You haven't added any team members yet.</p>
                <button
                  onClick={handleTeamManagement}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <i className="ri-user-add-line mr-2"></i>
                  Add Team Members
                </button>
              </div>
            ) : (
              // Team members grid/list
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {teamMembers.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    viewMode={viewMode}
                    feedbackCount={getMemberFeedbackCount(member.id)}
                    progressBadge={getProgressBadge(member.id)}
                    onViewProfile={() => handleViewMember(member)}
                  />
                ))}
              </div>
            )}
          </div>
        </MainContainer>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        open={memberModalOpen}
        onClose={() => {
          setMemberModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />
    </div>
  );
} 