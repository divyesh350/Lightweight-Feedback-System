import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// Optionally import MUI icons or use <i className="ri-*"></i> for RemixIcon

export default function Topbar({ notifications = 0, onRoleSwitch }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const handleProfile = () => {
    // Navigate to profile page or open profile modal
    toast.info('Profile feature coming soon!');
    setDropdownOpen(false);
  };

  const capitalizeFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center">
        <div className="lg:hidden mr-4 w-10 h-10 flex items-center justify-center text-gray-600 cursor-pointer" id="mobile-menu-button">
          <i className="ri-menu-line ri-lg"></i>
        </div>
        <div className="hidden lg:block">
          <span className="font-['Pacifico'] text-2xl text-primary">GrowWise</span>
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
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User Name'}</p>
              <p className="text-xs text-gray-500 capitalize">{capitalizeFirstLetter(role) || 'Role'}</p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`ri-arrow-down-s-line transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
            </div>
          </div>
          
          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User Name'}</p>
                <p className="text-xs text-gray-500 capitalize">{capitalizeFirstLetter(role) || 'Role'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
              </div>
              
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <i className="ri-user-line"></i>
                <span>Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
              >
                <i className="ri-logout-box-r-line"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 