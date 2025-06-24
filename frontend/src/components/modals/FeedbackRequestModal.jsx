import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from '@mui/material';
import FeedbackRequestForm from '../feedback/FeedbackRequestForm';

export default function FeedbackRequestModal({ open, onClose, onSuccess }) {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "rounded-lg",
      }}
    >
      <DialogTitle className="flex justify-between items-center p-6 pb-4">
        <Box className="flex items-center">
          <i className="ri-feedback-line text-2xl text-blue-600 mr-3"></i>
          <span className="text-xl font-semibold text-gray-800">
            Request Feedback
          </span>
        </Box>
        <IconButton
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <i className="ri-close-line text-xl"></i>
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="p-6 pt-0">
        <FeedbackRequestForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
} 