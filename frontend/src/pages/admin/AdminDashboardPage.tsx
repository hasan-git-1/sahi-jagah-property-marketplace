import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
} from '@mui/material';
import {
  People,
  Home,
  CalendarMonth,
  Message,
  TrendingUp,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import api from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AdminUsersTab } from './AdminUsersTab';
import { AdminPropertiesTab } from './AdminPropertiesTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';

interface DashboardMetrics {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalConversations: number;
  activeUsers: number;
  activeProperties: number;
  pendingVerifications: number;
  revenueThisMonth: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setMetrics(response.data.data);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  if (!metrics) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>
          Failed to load dashboard
        </Typography>
      </Container>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      subtitle: `${metrics.activeUsers} active`,
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Total Properties',
      value: metrics.totalProperties,
      subtitle: `${metrics.activeProperties} active`,
      icon: <Home sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light',
    },
    {
      title: 'Total Bookings',
      value: metrics.totalBookings,
      subtitle: 'All time',
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
    {
      title: 'Conversations',
      value: metrics.totalConversations,
      subtitle: 'Total messages',
      icon: <Message sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.light',
    },
    {
      title: 'Pending Verifications',
      value: metrics.pendingVerifications,
      subtitle: 'Needs review',
      icon: <HourglassEmpty sx={{ fontSize: 40 }} />,
      color: 'error.main',
      bgColor: 'error.light',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Platform overview and management
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: stat.bgColor,
                      borderRadius: 2,
                      display: 'flex',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="Analytics" />
          <Tab label="Users" />
          <Tab label="Properties" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {currentTab === 0 && <AdminAnalyticsTab />}
      {currentTab === 1 && <AdminUsersTab />}
      {currentTab === 2 && <AdminPropertiesTab />}
    </Container>
  );
};
