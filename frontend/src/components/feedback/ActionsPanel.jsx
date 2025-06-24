import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

export default function ActionsPanel({ onRequest, onExport, showRequestsList = false }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
        <div className="space-y-3 mb-6">
          <Button fullWidth variant="contained" color="primary" startIcon={<i className="ri-add-line"></i>} onClick={onRequest} className="!rounded-button">
            Request New Feedback
          </Button>
          <Button fullWidth variant="outlined" color="inherit" startIcon={<i className="ri-file-pdf-line"></i>} onClick={onExport} className="!rounded-button">
            Export Feedback to PDF
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 