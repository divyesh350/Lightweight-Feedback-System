import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Checkbox, FormControlLabel, CircularProgress, Alert, Autocomplete } from '@mui/material';
import { usePeerFeedbackStore } from '../../store/usePeerFeedbackStore';
import { getAllUsers } from '../../api/teamApi';
import { useAuthStore } from '../../store/useAuthStore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const sentimentOptions = [
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
];

export default function PeerFeedbackForm({ open, onClose }) {
  const [toUser, setToUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [strengths, setStrengths] = useState('');
  const [areasToImprove, setAreasToImprove] = useState('');
  const [sentiment, setSentiment] = useState('positive');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formError, setFormError] = useState(null);

  const { submitPeerFeedback, loading } = usePeerFeedbackStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (open) {
      setLoadingUsers(true);
      getAllUsers()
        .then(res => {
          // Exclude self from user list
          const filtered = res.data.filter(u => u.id !== user?.id);
          setUsers(filtered);
        })
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [open, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!toUser || !strengths || !areasToImprove) {
      setFormError('Please fill in all fields.');
      return;
    }
    try {
      await submitPeerFeedback({
        to_user_id: toUser.id,
        strengths,
        areas_to_improve: areasToImprove,
        sentiment,
        is_anonymous: isAnonymous,
      });
      onClose();
      setToUser(null);
      setStrengths('');
      setAreasToImprove('');
      setSentiment('positive');
      setIsAnonymous(false);
    } catch (err) {
      setFormError('Failed to submit feedback.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="peer-feedback-form-modal">
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Give Peer Feedback</Typography>
        {formError && <Alert severity="error" className="mb-2">{formError}</Alert>}
        <form onSubmit={handleSubmit}>
          <Autocomplete
            options={users}
            getOptionLabel={option => `${option.name} (${option.email})`}
            value={toUser}
            onChange={(_, value) => setToUser(value)}
            loading={loadingUsers}
            renderInput={(params) => (
              <TextField {...params} label="To (Select User)" margin="normal" required fullWidth />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disabled={loadingUsers}
          />
          <TextField
            label="Strengths"
            value={strengths}
            onChange={e => setStrengths(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Areas to Improve"
            value={areasToImprove}
            onChange={e => setAreasToImprove(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Sentiment"
            value={sentiment}
            onChange={e => setSentiment(e.target.value)}
            fullWidth
            margin="normal"
          >
            {sentimentOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={<Checkbox checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />}
            label="Send Anonymously"
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} disabled={loading.submitting}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading.submitting}>
              {loading.submitting ? <CircularProgress size={20} /> : 'Submit'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
} 