import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

export default function EmployeeDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employee" />
      <div className="flex-1 flex flex-col">
        <Topbar user={mockUser} notifications={3} />
        <MainContainer>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Feedback Timeline Section */}
            <div className="lg:w-8/12">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Feedback Dashboard</h1>
                <p className="text-gray-600 mt-1">View and manage your performance feedback</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-5 mb-6">Feedback Timeline</div>
            </div>
            {/* Actions Panel */}
            <div className="lg:w-4/12">
              <div className="bg-white rounded-lg shadow-sm p-5 mb-6 sticky top-24">Actions Panel</div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Feedback Summary</h3>
                <div className="h-64 bg-gray-50 rounded border border-gray-200 p-2" id="chart-container">Summary Chart</div>
              </div>
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 