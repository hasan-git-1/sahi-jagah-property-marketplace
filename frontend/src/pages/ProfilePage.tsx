import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';

function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhotoUrl || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await api.get(`/users/${user?.id}`);
      const userData = response.data.data;
      setName(userData.name);
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setProfilePhoto(userData.profilePhotoUrl || '');
      setEmailNotifications(userData.preferences?.emailNotifications ?? true);
      setSmsNotifications(userData.preferences?.smsNotifications ?? true);
      setPushNotifications(userData.preferences?.pushNotifications ?? true);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.put(`/users/${user?.id}`, { name });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post(`/users/${user?.id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfilePhoto(response.data.data.profilePhotoUrl);
      setSuccess('Profile photo updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.put(`/users/${user?.id}/preferences`, {
        emailNotifications,
        smsNotifications,
        pushNotifications,
      });
      setSuccess('Notification preferences updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar src={profilePhoto} sx={{ width: 100, height: 100, mr: 2 }} />
            <Button variant="outlined" component="label">
              Upload Photo
              <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
            </Button>
          </Box>

          <form onSubmit={handleUpdateProfile}>
            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              disabled
              sx={{ mb: 2 }}
              helperText="Email cannot be changed"
            />
            <TextField
              fullWidth
              label="Phone"
              value={phone}
              disabled
              sx={{ mb: 2 }}
              helperText="Phone cannot be changed"
            />
            <TextField
              fullWidth
              label="Role"
              value={user?.role}
              disabled
              sx={{ mb: 3 }}
              helperText="Role cannot be changed"
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </form>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
            }
            label="Push Notifications"
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleUpdatePreferences} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save Preferences'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default ProfilePage;
