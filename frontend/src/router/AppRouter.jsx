import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLandingPage from '../pages/AuthLandingPage';
import ManagerDashboardPage from '../pages/ManagerDashboardPage';
import ManagerFeedbackPage from '../pages/ManagerFeedbackPage';
import TeamMembersPage from '../pages/TeamMembersPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import EmployeeDashboardPage from '../pages/EmployeeDashboardPage';
import EmployeeFeedbackPage from '../pages/EmployeeFeedbackPage';
import PeerFeedbackPage from '../pages/PeerFeedbackPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function NotFoundPage() {
  return <div className="flex items-center justify-center min-h-screen text-2xl">404 - Not Found</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLandingPage />} />
        <Route 
          path="/dashboard/manager" 
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/feedback" 
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerFeedbackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/team" 
          element={
            <ProtectedRoute requiredRole="manager">
              <TeamMembersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute requiredRole="manager">
              <AnalyticsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/employee" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employee/feedback" 
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeFeedbackPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/peer-feedback" 
          element={
            <ProtectedRoute requiredRole="employee">
              <PeerFeedbackPage />
            </ProtectedRoute>
          } 
        />
      
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
} 