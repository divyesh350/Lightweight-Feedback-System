import React from 'react';
// Optionally import MUI icons or use <i className="ri-*"></i> for RemixIcon

export default function Topbar({ user, notifications = 0, onRoleSwitch }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center">
        <div className="lg:hidden mr-4 w-10 h-10 flex items-center justify-center text-gray-600 cursor-pointer" id="mobile-menu-button">
          <i className="ri-menu-line ri-lg"></i>
        </div>
        <div className="hidden lg:block">
          <span className="font-['Pacifico'] text-2xl text-primary">logo</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative dropdown">
          <div className="w-10 h-10 flex items-center justify-center text-gray-600 cursor-pointer">
            <i className="ri-notification-3-line ri-lg"></i>
            {notifications > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{notifications}</span>
            )}
          </div>
        </div>
        <div className="relative dropdown">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {/* Avatar image or fallback */}
              <img src={user?.avatar || 'https://via.placeholder.com/40'} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name || 'User Name'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-arrow-down-s-line"></i>
            </div>
          </div>
          {/* Dropdown menu (implement with state) */}
        </div>
      </div>
    </header>
  );
} 