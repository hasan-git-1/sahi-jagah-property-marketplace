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
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import { Block, CheckCircle, Refresh } from '@mui/icons-material';
import api from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from '@/components/Toast';

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: { role: roleFilter || undefined, search: search || undefined },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Role</InputLabel>
          <Select value={roleFilter} label="Role" onChange={(e) => setRoleFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="owner">Owner</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <Button startIcon={<Refresh />} onClick={loadUsers}>
          Refresh
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email/Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email || user.phone}</TableCell>
                <TableCell>
                  <Chip label={user.role} size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status || 'active'}
                    size="small"
                    color={user.status === 'suspended' ? 'error' : 'success'}
                  />
                </TableCell>
                <TableCell>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  {user.status === 'suspended' ? (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleStatusChange(user.id, 'active')}
                      title="Activate"
                    >
                      <CheckCircle />
                    </IconButton>
                  ) : (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleStatusChange(user.id, 'suspended')}
                      title="Suspend"
                    >
                      <Block />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
