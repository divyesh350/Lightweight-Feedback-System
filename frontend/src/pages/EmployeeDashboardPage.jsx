import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import FeedbackTimeline from '../components/feedback/FeedbackTimeline';
import ActionsPanel from '../components/feedback/ActionsPanel';
import PendingRequestCard from '../components/feedback/PendingRequestCard';
import FeedbackSummaryChart from '../components/charts/FeedbackSummaryChart';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

const feedbackList = [
  {
    id: 1,
    date: 'June 18, 2025',
    managerAvatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle-aged%20woman%20with%20shoulder-length%20brown%20hair%2C%20business%20attire%2C%20friendly%20smile%2C%20high%20quality%20portrait%20photo%2C%20studio%20lighting%2C%20clean%20background&width=200&height=200&seq=avatar2&orientation=squarish',
    managerName: 'Sarah Johnson',
    managerRole: 'Project Manager',
    sentiment: 'positive',
    sentimentLabel: 'Positive',
    summary: `David has shown exceptional leadership skills during the recent product launch. His ability to coordinate cross-functional teams and maintain clear communication channels was instrumental to our success.`,
    strengths: [
      'Excellent communication with stakeholders',
      'Proactive problem-solving approach',
      'Strong attention to detail in design work',
    ],
    improvements: [
      'Consider delegating more routine tasks',
      'Continue developing presentation skills',
    ],
    acknowledged: true,
  },
  {
    id: 2,
    date: 'June 10, 2025',
    managerAvatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20asian%20man%20in%20his%2040s%20with%20glasses%2C%20business%20attire%2C%20neutral%20expression%2C%20high%20quality%20portrait%20photo%2C%20studio%20lighting%2C%20clean%20background&width=200&height=200&seq=avatar3&orientation=squarish',
    managerName: 'Michael Chen',
    managerRole: 'Design Director',
    sentiment: 'mixed',
    sentimentLabel: 'Mixed',
    summary: `David's work on the mobile app redesign demonstrated strong visual design skills. The user interface is clean and intuitive. However, there were some delays in meeting deadlines that impacted the development team's schedule.`,
    strengths: [
      'Excellent visual design sensibility',
      'User-centered approach to UI solutions',
      'Receptive to feedback and iterations',
    ],
    improvements: [
      'Time management and meeting deadlines',
      'More proactive communication about potential delays',
      'Documentation of design decisions',
    ],
    acknowledged: false,
  },
];

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
                <FeedbackTimeline feedbackList={feedbackList} />
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