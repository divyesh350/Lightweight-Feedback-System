import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import FeedbackTimeline from '../components/feedback/FeedbackTimeline';
import ActionsPanel from '../components/feedback/ActionsPanel';
import PendingRequestCard from '../components/feedback/PendingRequestCard';
import FeedbackSummaryChart from '../components/charts/FeedbackSummaryChart';
import FeedbackRequestModal from '../components/modals/FeedbackRequestModal';
import { useFeedbackStore } from '../store/useFeedbackStore';
import { useFeedbackRequestStore } from '../store/useFeedbackRequestStore';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

const summaryChartData = [
  { month: 'Jan', Design: 3.8, Communication: 3.2, Collaboration: 4.0 },
  { month: 'Feb', Design: 4.2, Communication: 3.5, Collaboration: 3.8 },
  { month: 'Mar', Design: 3.9, Communication: 3.8, Collaboration: 4.1 },
  { month: 'Apr', Design: 4.5, Communication: 4.0, Collaboration: 4.3 },
  { month: 'May', Design: 4.2, Communication: 4.3, Collaboration: 4.2 },
  { month: 'Jun', Design: 4.7, Communication: 4.5, Collaboration: 4.6 },
];

export default function EmployeeDashboardPage() {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRequestsList, setShowRequestsList] = useState(false);
  
  const { feedbackList, loading, loadEmployeeFeedback, acknowledgeFeedback } = useFeedbackStore();
  const { requestsMade, loadRequestsMade, loading: { requestsMade: requestsLoading } } = useFeedbackRequestStore();

  useEffect(() => {
    loadEmployeeFeedback();
    loadRequestsMade();
  }, [loadEmployeeFeedback, loadRequestsMade]);

  const handleRequestFeedback = () => {
    setShowRequestModal(true);
  };

  const handleViewPendingRequests = () => {
    setShowRequestsList(!showRequestsList);
  };

  const handleExportFeedback = () => {
    // TODO: Implement PDF export functionality
    console.log('Export feedback to PDF');
  };

  const handleRequestSuccess = () => {
    // Refresh the requests list
    loadRequestsMade();
  };

  // Get the most recent 3 requests for the sidebar
  const recentRequests = requestsMade.slice(0, 3);

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
              <ActionsPanel 
                onRequest={handleRequestFeedback} 
                onViewPending={handleViewPendingRequests} 
                onExport={handleExportFeedback}
                showRequestsList={showRequestsList}
              />
              
              {/* Recent Requests Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Requests</h3>
                {requestsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-xs text-gray-500 mt-2">Loading requests...</p>
                  </div>
                ) : recentRequests.length > 0 ? (
                  <div className="space-y-2">
                    {recentRequests.map((request) => (
                      <PendingRequestCard key={request.id} request={request} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="ri-inbox-line text-2xl text-gray-400 mb-2"></i>
                    <p className="text-xs text-gray-500">No requests yet</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Feedback Summary</h3>
                <FeedbackSummaryChart data={summaryChartData} />
              </div>
            </div>
          </div>
        </MainContainer>
      </div>

      {/* Feedback Request Modal */}
      <FeedbackRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
} 