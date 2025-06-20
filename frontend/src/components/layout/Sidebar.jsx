import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Optionally import MUI icons or use <i className="ri-*"></i> for RemixIcon

const navItems = {
  manager: [
    { to: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { to: '/team', icon: 'ri-team-line', label: 'Team Members' },
    { to: '/feedback', icon: 'ri-feedback-line', label: 'Feedback' },
    { to: '/analytics', icon: 'ri-bar-chart-line', label: 'Analytics' },
    { to: '/templates', icon: 'ri-file-list-line', label: 'Templates' },
    { to: '/schedule', icon: 'ri-calendar-line', label: 'Schedule' },
    { to: '/settings', icon: 'ri-settings-line', label: 'Settings' },
  ],
  employee: [
    { to: '/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { to: '/feedback', icon: 'ri-feedback-line', label: 'My Feedback' },
    { to: '/feedback/requests', icon: 'ri-add-circle-line', label: 'Request Feedback' },
    { to: '/peer-feedback', icon: 'ri-team-line', label: 'Peer Feedback' },
    { to: '/export', icon: 'ri-file-pdf-line', label: 'Export PDF' },
    { to: '/notifications', icon: 'ri-notification-line', label: 'Notifications' },
    { to: '/profile', icon: 'ri-user-settings-line', label: 'Switch Role' },
  ]
};

export default function Sidebar({ role = 'manager', activePath }) {
  const location = useLocation();
  const items = navItems[role] || [];
  return (
    <aside className="w-60 bg-white border-r border-gray-200 fixed top-16 bottom-0 left-0 z-20 transition-transform duration-300 overflow-y-auto">
      <nav className="py-4">
        <div className="px-4 mb-6">
          <span className="font-['Pacifico'] text-2xl text-primary">logo</span>
        </div>
        <ul>
          {items.map(item => (
            <li key={item.to}>
              <Link to={item.to} className={`nav-item flex items-center space-x-3 px-4 py-3 text-sm ${location.pathname === item.to ? 'active text-primary' : 'text-gray-700'}`}>
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={item.icon}></i>
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 