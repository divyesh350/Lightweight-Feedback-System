import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import StatCard from '../components/dashboard/StatCard';
import SentimentDonutChart from '../components/charts/SentimentDonutChart';
import FeedbackTrendChart from '../components/charts/FeedbackTrendChart';
import TeamMemberCard from '../components/team/TeamMemberCard';
import FeedbackCard from '../components/feedback/FeedbackCard';

const mockUser = { name: 'John Smith', role: 'Manager', avatar: '' };

const stats = [
  {
    icon: 'ri-feedback-line',
    label: 'Total Feedback',
    value: 128,
    change: '12.5%',
    color: 'blue',
    trend: 'up',
  },
  {
    icon: 'ri-emotion-happy-line',
    label: 'Positive Sentiment',
    value: '72%',
    change: '5.3%',
    color: 'green',
    trend: 'up',
  },
  {
    icon: 'ri-time-line',
    label: 'Pending Reviews',
    value: 17,
    change: '8.2%',
    color: 'yellow',
    trend: 'up',
  },
  {
    icon: 'ri-team-line',
    label: 'Team Members',
    value: 12,
    change: '2 new',
    color: 'purple',
    trend: 'up',
  },
];

const sentimentData = [
  { name: 'Positive', value: 72 },
  { name: 'Neutral', value: 18 },
  { name: 'Negative', value: 10 },
];

const trendData = [
  { name: 'Week 1', Positive: 25, Neutral: 8, Negative: 5 },
  { name: 'Week 2', Positive: 32, Neutral: 10, Negative: 4 },
  { name: 'Week 3', Positive: 35, Neutral: 6, Negative: 3 },
  { name: 'Week 4', Positive: 38, Neutral: 8, Negative: 2 },
];

const team = [
  { name: 'Emily Anderson', role: 'Product Designer', sentiment: 'positive', sentimentLabel: 'Positive', sentimentValue: '95%', reviews: 4 },
  { name: 'Robert Johnson', role: 'Frontend Developer', sentiment: 'positive', sentimentLabel: 'Positive', sentimentValue: '88%', reviews: 5 },
  { name: 'Sarah Lee', role: 'neutral', sentiment: 'neutral', sentimentLabel: 'Neutral', sentimentValue: '75%', reviews: 3 },
  { name: 'Michael Patel', role: 'Backend Developer', sentiment: 'positive', sentimentLabel: 'Positive', sentimentValue: '92%', reviews: 6 },
  { name: 'Jessica Wong', role: 'Product Manager', sentiment: 'positive', sentimentLabel: 'Positive', sentimentValue: '90%', reviews: 8 },
  { name: 'David Miller', role: 'Data Analyst', sentiment: 'neutral', sentimentLabel: 'Neutral', sentimentValue: '78%', reviews: 4 },
];

const feedbacks = [
  {
    avatar: '',
    name: 'Emily Anderson',
    role: 'Product Designer',
    date: 'June 18, 2025',
    sentiment: 'positive',
    sentimentLabel: 'Positive',
    strengths: ['High-quality designs', 'Attention to detail', 'Communication'],
    improvements: ['More collaboration with dev team'],
    tags: ['Design', 'Communication', 'Productivity'],
    commentsCount: 2,
    acknowledged: true,
  },
  {
    avatar: '',
    name: 'Robert Johnson',
    role: 'Frontend Developer',
    date: 'June 15, 2025',
    sentiment: 'neutral',
    sentimentLabel: 'Neutral',
    strengths: ['Clean code', 'Quick learner', 'Thorough reviews'],
    improvements: ['Proactive communication'],
    tags: ['Technical Skills', 'Communication', 'Code Quality'],
    commentsCount: 0,
    acknowledged: false,
  },
  {
    avatar: '',
    name: 'Sarah Lee',
    role: 'UX Researcher',
    date: 'June 10, 2025',
    sentiment: 'negative',
    sentimentLabel: 'Negative',
    strengths: ['Research methodology', 'Comprehensive reports'],
    improvements: ['Time management', 'Collaboration'],
    tags: ['Research', 'Time Management', 'Collaboration'],
    commentsCount: 5,
    acknowledged: false,
  },
];

export default function ManagerDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="manager" />
      <div className="flex-1 flex flex-col">
        <Topbar user={mockUser} notifications={3} />
        <MainContainer>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Sentiment Overview</h2>
              <SentimentDonutChart data={sentimentData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-4">Feedback Trends</h2>
              <FeedbackTrendChart data={trendData} />
            </div>
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
              {team.map((member, i) => (
                <TeamMemberCard key={i} {...member} />
              ))}
            </div>
          </div>
          {/* Recent Feedback Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Feedback</h2>
            </div>
            <div className="space-y-4">
              {feedbacks.map((fb, i) => (
                <FeedbackCard key={i} {...fb} />
              ))}
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
} 