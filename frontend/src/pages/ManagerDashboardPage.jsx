import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';

const mockUser = { name: 'John Smith', role: 'Manager', avatar: '' };

export default function ManagerDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar user={mockUser} notifications={3} />
        <MainContainer>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* ...stat cards here... */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Stat 1</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Stat 2</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Stat 3</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Stat 4</div>
          </div>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Sentiment Donut Chart</div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Feedback Trend Chart</div>
          </div>
          {/* Team Members Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Team Members</h2>
              <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                <span>View All</span>
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* ...team member cards... */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Team Member 1</div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Team Member 2</div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Team Member 3</div>
            </div>
          </div>
          {/* Recent Feedback Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Feedback</h2>
            </div>
            <div className="space-y-4">
              {/* ...feedback cards... */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Feedback 1</div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">Feedback 2</div>
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 