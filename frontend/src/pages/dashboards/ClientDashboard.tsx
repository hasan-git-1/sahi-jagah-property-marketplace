import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Search,
  Favorite,
  CalendarMonth,
  Message,
  TrendingUp,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  city: string;
  images: string[];
}

interface Booking {
  id: string;
  propertyTitle: string;
  scheduledDate: string;
  status: string;
}

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    upcomingBookings: 0,
    completedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [favoritesRes, bookingsRes] = await Promise.all([
        api.get('/favorites'),
        api.get('/bookings'),
      ]);

      const favoritesData = favoritesRes.data.data;
      const bookingsData = bookingsRes.data.data;

      setFavorites(favoritesData.slice(0, 4));
      setBookings(
        bookingsData
          .filter((b: Booking) => ['requested', 'confirmed'].includes(b.status))
          .slice(0, 5)
      );

      // Load recent searches from localStorage
      const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(searches.slice(0, 5));

      setStats({
        totalFavorites: favoritesData.length,
        upcomingBookings: bookingsData.filter(
          (b: Booking) => b.status === 'confirmed' || b.status === 'requested'
        ).length,
        completedBookings: bookingsData.filter((b: Booking) => b.status === 'completed').length,
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Client Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your property search.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'error.light',
                  borderRadius: 2,
                  display: 'flex',
                }}
              >
                <Favorite sx={{ color: 'error.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.totalFavorites}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saved Favorites
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
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
                  {stats.upcomingBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Visits
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
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
                <TrendingUp sx={{ color: 'success.main', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {stats.completedBookings}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Visits
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Saved Favorites */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Saved Favorites
              </Typography>
              <Button size="small" onClick={() => navigate('/favorites')}>
                View All
              </Button>
            </Box>

            {favorites.length > 0 ? (
              <Grid container spacing={2}>
                {favorites.map((property) => (
                  <Grid item xs={12} sm={6} key={property.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="150"
                        image={property.images[0] || 'https://via.placeholder.com/300x200'}
                        alt={property.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} noWrap>
                          {property.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {property.city}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="primary">
                          ₹{property.price.toLocaleString()}
                          {property.type === 'rent' && (
                            <Typography component="span" variant="caption">
                              /month
                            </Typography>
                          )}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/properties/${property.id}`)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No saved favorites yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/search')}
                >
                  Start Searching
                </Button>
              </Box>
            )}
          </Paper>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Searches
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recentSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={search}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(search)}`)}
                    clickable
                  />
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Upcoming Bookings & Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Upcoming Visits
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
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={booking.status}
                              size="small"
                              color={booking.status === 'confirmed' ? 'success' : 'warning'}
                              sx={{ mt: 0.5 }}
                            />
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                      />
                    </ListItem>
                    {index < bookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No upcoming visits scheduled
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Search />}
                onClick={() => navigate('/search')}
              >
                Search Properties
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Favorite />}
                onClick={() => navigate('/favorites')}
              >
                View Favorites
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarMonth />}
                onClick={() => navigate('/bookings')}
              >
                My Bookings
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Message />}
                onClick={() => navigate('/messages')}
              >
                Messages
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
