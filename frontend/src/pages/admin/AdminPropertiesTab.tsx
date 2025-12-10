import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { CheckCircle, Cancel, Refresh, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/components/Toast';

export const AdminPropertiesTab: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [verificationFilter, setVerificationFilter] = useState('pending');
  const [verifyDialog, setVerifyDialog] = useState<{
    open: boolean;
    propertyId: string;
    approved: boolean;
  } | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadProperties();
  }, [verificationFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/properties', {
        params: { verificationStatus: verificationFilter || undefined },
      });
      setProperties(response.data.data);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyDialog) return;

    try {
      await api.put(`/admin/properties/${verifyDialog.propertyId}/verify`, {
        approved: verifyDialog.approved,
        reason: reason || undefined,
      });
      toast.success(
        `Property ${verifyDialog.approved ? 'verified' : 'rejected'} successfully`
      );
      setVerifyDialog(null);
      setReason('');
      loadProperties();
    } catch (error) {
      console.error('Failed to verify property:', error);
      toast.error('Failed to verify property');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Paper>
        <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Verification Status</InputLabel>
            <Select
              value={verificationFilter}
              label="Verification Status"
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          <Button startIcon={<Refresh />} onClick={loadProperties}>
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verification</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>{property.address?.city}</TableCell>
                  <TableCell>
                    <Chip label={property.type} size="small" />
                  </TableCell>
                  <TableCell>₹{property.price?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={property.status}
                      size="small"
                      color={property.status === 'active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={property.verificationStatus || 'pending'}
                      size="small"
                      color={
                        property.verificationStatus === 'verified'
                          ? 'success'
                          : property.verificationStatus === 'rejected'
                            ? 'error'
                            : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/properties/${property.id}`)}
                      title="View"
                    >
                      <Visibility />
                    </IconButton>
                    {property.verificationStatus === 'pending' && (
                      <>
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() =>
                            setVerifyDialog({
                              open: true,
                              propertyId: property.id,
                              approved: true,
                            })
                          }
                          title="Approve"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setVerifyDialog({
                              open: true,
                              propertyId: property.id,
                              approved: false,
                            })
                          }
                          title="Reject"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Verification Dialog */}
      <Dialog
        open={verifyDialog?.open || false}
        onClose={() => setVerifyDialog(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {verifyDialog?.approved ? 'Approve Property' : 'Reject Property'}
        </DialogTitle>
        <DialogContent>
          {!verifyDialog?.approved && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for rejection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialog(null)}>Cancel</Button>
          <Button
            variant="contained"
            color={verifyDialog?.approved ? 'success' : 'error'}
            onClick={handleVerify}
          >
            {verifyDialog?.approved ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
