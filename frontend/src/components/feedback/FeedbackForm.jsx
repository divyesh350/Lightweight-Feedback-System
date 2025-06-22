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
} from '@mui/material';
import { useManagerDashboardStore } from '../../store/useManagerDashboardStore';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeedbackForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    strengths: '',
    areas_to_improve: '',
    sentiment: 'positive',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    teamMembers, 
    loadTeamMembers, 
    loading: { team: teamLoading },
    createFeedback, 
    updateFeedback 
  } = useManagerDashboardStore();

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  // Set initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        employee_id: initialData.employee_id || '',
        strengths: initialData.strengths || '',
        areas_to_improve: initialData.areas_to_improve || '',
        sentiment: initialData.sentiment || 'positive',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }

    if (!formData.strengths.trim()) {
      newErrors.strengths = 'Strengths are required';
    }

    if (!formData.areas_to_improve.trim()) {
      newErrors.areas_to_improve = 'Areas to improve are required';
    }

    if (!formData.sentiment) {
      newErrors.sentiment = 'Please select a sentiment';
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

    setIsSubmitting(true);
    try {
      if (initialData) {
        // Update existing feedback
        await updateFeedback(initialData.id, formData);
        toast.success('Feedback updated successfully!');
      } else {
        // Create new feedback
        await createFeedback(formData);
        toast.success('Feedback sent successfully!');
      }
      
      // Reset form
      setFormData({
        employee_id: '',
        strengths: '',
        areas_to_improve: '',
        sentiment: 'positive',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'neutral': return 'warning';
      case 'negative': return 'error';
      default: return 'primary';
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
          {initialData ? 'Edit Feedback' : 'Send Feedback to Team Member'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <FormControl fullWidth error={!!errors.employee_id} disabled={teamLoading}>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={formData.employee_id}
              onChange={(e) => handleInputChange('employee_id', e.target.value)}
              label="Select Employee"
            >
              {teamLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={20} className="mr-2" />
                  Loading team members...
                </MenuItem>
              ) : teamMembers.length === 0 ? (
                <MenuItem disabled>No team members available</MenuItem>
              ) : (
                teamMembers.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.employee_id && (
              <Typography variant="caption" color="error" className="mt-1">
                {errors.employee_id}
              </Typography>
            )}
          </FormControl>

          {/* Strengths */}
          <TextField
            fullWidth
            label="Strengths"
            multiline
            rows={3}
            value={formData.strengths}
            onChange={(e) => handleInputChange('strengths', e.target.value)}
            error={!!errors.strengths}
            helperText={errors.strengths || "What are the employee's key strengths and positive contributions?"}
            placeholder="e.g., Excellent communication skills, great team player, consistently meets deadlines..."
          />

          {/* Areas to Improve */}
          <TextField
            fullWidth
            label="Areas to Improve"
            multiline
            rows={3}
            value={formData.areas_to_improve}
            onChange={(e) => handleInputChange('areas_to_improve', e.target.value)}
            error={!!errors.areas_to_improve}
            helperText={errors.areas_to_improve || "What areas could the employee work on to improve their performance?"}
            placeholder="e.g., Time management, technical skills, leadership development..."
          />

          {/* Sentiment */}
          <FormControl fullWidth error={!!errors.sentiment}>
            <InputLabel>Overall Sentiment</InputLabel>
            <Select
              value={formData.sentiment}
              onChange={(e) => handleInputChange('sentiment', e.target.value)}
              label="Overall Sentiment"
            >
              <MenuItem value="positive">
                <Box className="flex items-center">
                  <i className="ri-emotion-happy-line text-green-500 mr-2"></i>
                  Positive
                </Box>
              </MenuItem>
              <MenuItem value="neutral">
                <Box className="flex items-center">
                  <i className="ri-emotion-normal-line text-yellow-500 mr-2"></i>
                  Neutral
                </Box>
              </MenuItem>
              <MenuItem value="negative">
                <Box className="flex items-center">
                  <i className="ri-emotion-unhappy-line text-red-500 mr-2"></i>
                  Negative
                </Box>
              </MenuItem>
            </Select>
            {errors.sentiment && (
              <Typography variant="caption" color="error" className="mt-1">
                {errors.sentiment}
              </Typography>
            )}
          </FormControl>

          {/* Action Buttons */}
          <Grid container spacing={2} className="mt-6">
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
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
                color={getSentimentColor(formData.sentiment)}
                disabled={isSubmitting || teamLoading}
                className="h-12"
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <i className="ri-send-plane-line"></i>
                  )
                }
              >
                {isSubmitting ? 'Sending...' : initialData ? 'Update Feedback' : 'Send Feedback'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
} 