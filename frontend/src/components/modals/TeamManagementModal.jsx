import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Box, Modal, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { useTeamStore } from '../../store/useTeamStore';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function TeamManagementModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('team'); // 'team' or 'available'
  const {
    teamMembers,
    availableEmployees,
    loading,
    error,
    loadAllTeamData,
    addTeamMember,
    removeTeamMember,
    clearError,
  } = useTeamStore();

  // Load data when modal opens
  useEffect(() => {
    if (open) {
      loadAllTeamData();
      clearError();
    }
  }, [open, loadAllTeamData, clearError]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleAddTeamMember = async (employeeId) => {
    try {
      await addTeamMember(employeeId);
      toast.success('Team member added successfully!');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleRemoveTeamMember = async (employeeId) => {
    try {
      await removeTeamMember(employeeId);
      toast.success('Team member removed successfully!');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const renderTeamMembers = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 mb-4">Current Team Members</h3>
      {loading.team ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-8">
          <i className="ri-team-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No team members yet</p>
        </div>
      ) : (
        teamMembers.map((member) => (
          <div key={member.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleRemoveTeamMember(member.id)}
              disabled={loading.remove}
              startIcon={loading.remove ? <CircularProgress size={16} /> : <i className="ri-user-unfollow-line"></i>}
            >
              Remove
            </Button>
          </div>
        ))
      )}
    </div>
  );

  const renderAvailableEmployees = () => (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 mb-4">Available Employees</h3>
      {loading.available ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : availableEmployees.length === 0 ? (
        <div className="text-center py-8">
          <i className="ri-user-add-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No available employees</p>
        </div>
      ) : (
        availableEmployees.map((employee) => (
          <div key={employee.id} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{employee.name}</p>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => handleAddTeamMember(employee.id)}
              disabled={loading.add}
              startIcon={loading.add ? <CircularProgress size={16} /> : <i className="ri-user-add-line"></i>}
            >
              Add to Team
            </Button>
          </div>
        ))
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
          <Box component={motion.div}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative outline-none max-h-[80vh] overflow-y-auto"
          >
            <IconButton onClick={onClose} className="!absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <i className="ri-close-line ri-lg"></i>
            </IconButton>
            
            <div className="text-center mb-6">
              <Typography variant="h6" className="text-xl font-semibold text-gray-800">
                Team Management
              </Typography>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('team')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'team'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team Members ({teamMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'available'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Available ({availableEmployees.length})
              </button>
            </div>

            {/* Content */}
            {activeTab === 'team' ? renderTeamMembers() : renderAvailableEmployees()}
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
} 