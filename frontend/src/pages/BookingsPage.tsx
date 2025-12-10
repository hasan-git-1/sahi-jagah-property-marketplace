import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

interface Booking {
  id: string;
  propertyId: string;
  scheduledAt: string;
  status: string;
  notes?: string;
  createdAt: string;
}

function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}`, { status: 'confirmed' });
      loadBookings();
    } catch (error) {
      console.error('Failed to confirm booking:', error);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    try {
      await api.put(`/bookings/${selectedBooking.id}`, {
        status: 'cancelled',
        cancellationReason,
      });
      setActionDialogOpen(false);
      setCancellationReason('');
      setSelectedBooking(null);
      loadBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'requested':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {user?.role === 'client'
            ? 'Your scheduled property visits'
            : 'Visit requests for your properties'}
        </Typography>

        {bookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {user?.role === 'client'
                ? 'Schedule a visit to view properties'
                : 'No visit requests received yet'}
            </Typography>
            {user?.role === 'client' && (
              <Button variant="contained" onClick={() => navigate('/search')}>
                Search Properties
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => navigate(`/properties/${booking.propertyId}`)}
                      >
                        View Property
                      </Button>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.scheduledAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{booking.notes || '-'}</TableCell>
                    <TableCell>
                      {booking.status === 'requested' && user?.role !== 'client' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleConfirm(booking.id)}
                          sx={{ mr: 1 }}
                        >
                          Confirm
                        </Button>
                      )}
                      {(booking.status === 'requested' || booking.status === 'confirmed') && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setActionDialogOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Cancellation Reason"
            multiline
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Close</Button>
          <Button onClick={handleCancel} variant="contained" color="error">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BookingsPage;
