import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLandingPage from '../pages/AuthLandingPage';
import ManagerDashboardPage from '../pages/ManagerDashboardPage';
import EmployeeDashboardPage from '../pages/EmployeeDashboardPage';

function NotFoundPage() {
  return <div className="flex items-center justify-center min-h-screen text-2xl">404 - Not Found</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLandingPage />} />
        <Route path="/dashboard/manager" element={<ManagerDashboardPage />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
} 