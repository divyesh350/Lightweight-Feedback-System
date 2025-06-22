import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Modal, IconButton } from '@mui/material';
import FeedbackForm from '../feedback/FeedbackForm';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function FeedbackFormModal({ 
  open, 
  onClose, 
  initialData = null,
  onSuccess = null 
}) {
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
    <AnimatePresence>
      {open && (
        <Modal 
          open={open} 
          onClose={onClose} 
          className="flex items-center justify-center p-4"
        >
          <Box 
            component={motion.div}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative outline-none max-h-[90vh] overflow-y-auto"
          >
            <IconButton 
              onClick={onClose} 
              className="!absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <i className="ri-close-line ri-lg"></i>
            </IconButton>
            
            <div className="p-6">
              <FeedbackForm
                initialData={initialData}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
} 