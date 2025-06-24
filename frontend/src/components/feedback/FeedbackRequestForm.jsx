import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import { useFeedbackRequestStore } from '../../store/useFeedbackRequestStore';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeedbackRequestForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    target_id: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const { 
    managers, 
    loadManagers, 
    createRequest,
    loading: { managers: managersLoading, submitting },
    error,
    clearError
  } = useFeedbackRequestStore();

  // Load managers on component mount
  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  // Clear error when component unmounts or when error changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.target_id) {
      newErrors.target_id = 'Please select a manager';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createRequest(formData);
      toast.success('Feedback request sent successfully!');
      
      // Reset form
      setFormData({
        target_id: '',
        message: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the store and displayed via toast
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
    >
      <Paper elevation={3} className="p-6">
        <Typography variant="h6" className="mb-6 text-gray-800 font-semibold">
          Request Feedback
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Manager Selection */}
          <FormControl fullWidth error={!!errors.target_id} disabled={managersLoading}>
            <InputLabel>Select Manager</InputLabel>
            <Select
              value={formData.target_id}
              onChange={(e) => handleInputChange('target_id', e.target.value)}
              label="Select Manager"
            >
              {managersLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} className="mr-2" />
                  Loading managers...
                </MenuItem>
              ) : managers.length === 0 ? (
                <MenuItem disabled>No managers available</MenuItem>
              ) : (
                managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.name} ({manager.email})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.target_id && (
              <Typography variant="caption" color="error" className="mt-1">
                {errors.target_id}
              </Typography>
            )}
          </FormControl>

          {/* Message */}
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            error={!!errors.message}
            helperText={errors.message || "What specific feedback would you like to request? Be specific about the area or project you'd like feedback on."}
            placeholder="e.g., Could you give me feedback on my recent project presentation? I'd like to know how I can improve my public speaking skills and make my presentations more engaging..."
          />

          {/* Action Buttons */}
          <Grid container spacing={2} className="mt-6">
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancel}
                disabled={submitting}
                className="h-12"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || managersLoading}
                className="h-12"
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <i className="ri-send-plane-line"></i>
                  )
                }
              >
                {submitting ? 'Sending Request...' : 'Send Request'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
} 