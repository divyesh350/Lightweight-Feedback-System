import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import MainContainer from '../components/layout/MainContainer';
import { usePeerFeedbackStore } from '../store/usePeerFeedbackStore';
import PeerFeedbackForm from '../components/feedback/PeerFeedbackForm';
import PeerFeedbackList from '../components/feedback/PeerFeedbackList';
import { Button, CircularProgress, Alert, Typography } from '@mui/material';

const mockUser = { name: 'David Mitchell', role: 'Employee', avatar: '' };

export default function PeerFeedbackPage() {
  const [formOpen, setFormOpen] = useState(false);
  const {
    feedbackGiven,
    feedbackReceived,
    loading,
    error,
    loadFeedbackGiven,
    loadFeedbackReceived,
    clearError,
  } = usePeerFeedbackStore();

  useEffect(() => {
    loadFeedbackGiven();
    loadFeedbackReceived();
  }, [loadFeedbackGiven, loadFeedbackReceived]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="employee" />
      <div className="flex-1 flex flex-col">
        <Topbar user={mockUser} notifications={3} />
        <MainContainer>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Typography variant="h4" className="text-gray-900 font-semibold mb-2">
                Peer Feedback
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Give and receive feedback from your peers
              </Typography>
            </div>
            <Button variant="contained" color="primary" onClick={() => setFormOpen(true)}>
              <i className="ri-add-line mr-2"></i> Give Peer Feedback
            </Button>
          </div>

          {error && (
            <Alert severity="error" className="mb-4">{error}</Alert>
          )}

          {(loading.given || loading.received) ? (
            <div className="flex justify-center items-center py-12">
              <CircularProgress />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Typography variant="h6" className="mb-3 text-gray-800 font-semibold">
                  Feedback Given
                </Typography>
                <PeerFeedbackList feedbackList={feedbackGiven} type="given" />
              </div>
              <div>
                <Typography variant="h6" className="mb-3 text-gray-800 font-semibold">
                  Feedback Received
                </Typography>
                <PeerFeedbackList feedbackList={feedbackReceived} type="received" />
              </div>
            </div>
          )}

          <PeerFeedbackForm open={formOpen} onClose={() => setFormOpen(false)} />
        </MainContainer>
      </div>
    </div>
  );
} 