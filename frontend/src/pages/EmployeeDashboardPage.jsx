import React, { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import FeedbackTimeline from '../components/feedback/FeedbackTimeline';
import ActionsPanel from '../components/feedback/ActionsPanel';
import PendingRequestCard from '../components/feedback/PendingRequestCard';
import FeedbackSummaryChart from '../components/charts/FeedbackSummaryChart';
import { useFeedbackStore } from '../store/useFeedbackStore';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

const pendingRequests = [
  { title: 'Project Feedback', status: 'pending', managerName: 'Sarah Johnson', date: 'June 15, 2025' },
  { title: 'Quarterly Review', status: 'inprogress', managerName: 'Michael Chen', date: 'June 1, 2025' },
];

const summaryChartData = [
  { month: 'Jan', Design: 3.8, Communication: 3.2, Collaboration: 4.0 },
  { month: 'Feb', Design: 4.2, Communication: 3.5, Collaboration: 3.8 },
  { month: 'Mar', Design: 3.9, Communication: 3.8, Collaboration: 4.1 },
  { month: 'Apr', Design: 4.5, Communication: 4.0, Collaboration: 4.3 },
  { month: 'May', Design: 4.2, Communication: 4.3, Collaboration: 4.2 },
  { month: 'Jun', Design: 4.7, Communication: 4.5, Collaboration: 4.6 },
];

export default function EmployeeDashboardPage() {
  const { feedbackList, loading, loadEmployeeFeedback, acknowledgeFeedback } = useFeedbackStore();

  useEffect(() => {
    loadEmployeeFeedback();
  }, [loadEmployeeFeedback]);

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
              <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                <FeedbackTimeline
                  feedbackList={feedbackList}
                  onAcknowledge={acknowledgeFeedback}
                />
                {loading && <div>Loading...</div>}
              </div>
            </div>
            {/* Actions Panel */}
            <div className="lg:w-4/12">
              <ActionsPanel onRequest={() => {}} onViewPending={() => {}} onExport={() => {}} />
              <h3 className="text-sm font-medium text-gray-900 mb-3">Pending Requests</h3>
              <div className="space-y-3">
                {pendingRequests.map((req, i) => (
                  <PendingRequestCard key={i} {...req} />
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Feedback Summary</h3>
                <FeedbackSummaryChart data={summaryChartData} />
              </div>
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 