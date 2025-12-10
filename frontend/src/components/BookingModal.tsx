import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '@/services/api';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

function BookingModal({ open, onClose, propertyId, propertyTitle, onSuccess }: BookingModalProps) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/bookings', {
        propertyId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setScheduledAt('');
    setNotes('');
    setError('');
    setSuccess(false);
    onClose();
  };

  // Get minimum date/time (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule a Visit</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {success ? (
            <Alert severity="success">
              Booking request sent successfully! The owner will confirm your visit.
            </Alert>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Property"
                value={propertyTitle}
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Preferred Date & Time"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getMinDateTime() }}
                sx={{ mb: 2 }}
                helperText="Select your preferred visit date and time"
              />

              <TextField
                fullWidth
                label="Notes (Optional)"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific requirements or questions..."
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!success && (
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Request Visit'}
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BookingModal;
