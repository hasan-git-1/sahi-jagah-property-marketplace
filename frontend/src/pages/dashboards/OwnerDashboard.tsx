import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Add,
  Visibility,
  Favorite,
  CalendarMonth,
  TrendingUp,
  Edit,
  Message,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  status: string;
  views: number;
  favorites: number;
  inquiries: number;
  images: string[];
}

interface Booking {
  id: string;
  propertyTitle: string;
  clientName: string;
  scheduledDate: string;
  status: string;
}

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        api.get('/properties', { params: { myProperties: true } }),
        api.get('/bookings'),
      ]);

      const propertiesData = propertiesRes.data.data;
      const bookingsData = bookingsRes.data.data;

      setProperties(propertiesData.slice(0, 6));
      setBookings(bookingsData.filter((b: Booking) => b.status === 'requested').slice(0, 5));

      setStats({
        totalProperties: propertiesData.length,
        activeProperties: propertiesData.filter((p: Property) => p.status === 'active').length,
        totalViews: propertiesData.reduce((sum: number, p: Property) => sum + p.views, 0),
        pendingBookings: bookingsData.filter((b: Booking) => b.status === 'requested').length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Owner Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/properties/create')}
        >
          List New Property
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'primary.light',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <TrendingUp sx={{ color: 'primary.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.totalProperties}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Properties
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'success.light',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <Visibility sx={{ color: 'success.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.totalViews}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Views
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'warning.light',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <CalendarMonth sx={{ color: 'warning.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.pendingBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Bookings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'info.light',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <Favorite sx={{ color: 'info.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.activeProperties}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Listings
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* My Properties */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                My Properties
              </Typography>
              <Button size="small" onClick={() => navigate('/properties')}>
                View All
              </Button>
            </Box>

            <Grid container spacing={2}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} key={property.id}>
                  <Card>
                    <Box
                      sx={{
                        height: 150,
                        backgroundImage: `url(${property.images[0] || 'https://via.placeholder.com/300x200'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {property.title}
                      </Typography>
                      <Typography variant="h6" color="primary" gutterBottom>
                        ₹{property.price.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip
                          label={property.status}
                          size="small"
                          color={property.status === 'active' ? 'success' : 'default'}
                        />
                        <Chip label={property.type} size="small" variant="outlined" />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Visibility fontSize="small" color="action" />
                          <Typography variant="caption">{property.views}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Favorite fontSize="small" color="action" />
                          <Typography variant="caption">{property.favorites}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Message fontSize="small" color="action" />
                          <Typography variant="caption">{property.inquiries}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/properties/${property.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => navigate(`/properties/${property.id}`)}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {properties.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No properties listed yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/properties/create')}
                >
                  List Your First Property
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Booking Requests */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Booking Requests
              </Typography>
              <Button size="small" onClick={() => navigate('/bookings')}>
                View All
              </Button>
            </Box>

            {bookings.length > 0 ? (
              <List>
                {bookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        primary={booking.propertyTitle}
                        secondary={
                          <>
                            <Typography variant="caption" display="block">
                              {booking.clientName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate('/bookings')}
                      >
                        Review
                      </Button>
                    </ListItem>
                    {index < bookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No pending booking requests
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Add />}
                onClick={() => navigate('/properties/create')}
              >
                List Property
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Message />}
                onClick={() => navigate('/messages')}
              >
                Messages
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarMonth />}
                onClick={() => navigate('/bookings')}
              >
                Manage Bookings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
