import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import { LocationOn, Bed, Bathtub, SquareFoot, Favorite, FavoriteBorder, Message } from '@mui/icons-material';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import BookingModal from '@/components/BookingModal';
import { messagingService } from '@/services/messagingService';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishingStatus?: string;
  amenities: string[];
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  photos: Array<{ url: string }>;
  ownerId: string;
}

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    loadProperty();
    if (isAuthenticated) {
      checkFavorite();
    }
  }, [id, isAuthenticated]);

  const loadProperty = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data.data);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/check/${id}`);
      setIsFavorite(response.data.data.isFavorite);
    } catch (error) {
      console.error('Failed to check favorite:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { propertyId: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleContactOwner = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!property) return;

    setContactLoading(true);
    try {
      const conversation = await messagingService.createConversation(
        property.ownerId,
        property.id
      );
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container>
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5">Property not found</Typography>
          <Button onClick={() => navigate('/properties')} sx={{ mt: 2 }}>
            Back to Properties
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button onClick={() => navigate('/properties')} sx={{ mb: 2 }}>
          ← Back to Properties
        </Button>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
              <img
                src={property.photos[0]?.url || 'https://via.placeholder.com/800x600'}
                alt={property.title}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                {property.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" color="text.secondary">
                  {property.address.line1}, {property.address.city}, {property.address.state} -{' '}
                  {property.address.pincode}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {property.bedrooms && (
                  <Chip icon={<Bed />} label={`${property.bedrooms} Bedrooms`} />
                )}
                {property.bathrooms && (
                  <Chip icon={<Bathtub />} label={`${property.bathrooms} Bathrooms`} />
                )}
                {property.area && (
                  <Chip icon={<SquareFoot />} label={`${property.area} sqft`} />
                )}
                {property.furnishingStatus && (
                  <Chip label={property.furnishingStatus} variant="outlined" />
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" paragraph>
                {property.description}
              </Typography>

              {property.amenities.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {property.amenities.map((amenity) => (
                      <Chip key={amenity} label={amenity} variant="outlined" />
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                ₹{property.price.toLocaleString()}
                {property.type === 'rent' && (
                  <Typography component="span" variant="h6" color="text.secondary">
                    /month
                  </Typography>
                )}
              </Typography>

              <Chip
                label={property.type === 'rent' ? 'For Rent' : 'For Sale'}
                color="primary"
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mb: 2 }}
                startIcon={<Message />}
                onClick={handleContactOwner}
                disabled={contactLoading}
              >
                {contactLoading ? <CircularProgress size={24} /> : 'Contact Owner'}
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ mb: 2 }}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    setBookingModalOpen(true);
                  }
                }}
              >
                Schedule Visit
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                color={isFavorite ? 'error' : 'primary'}
              >
                {favoriteLoading ? (
                  <CircularProgress size={24} />
                ) : isFavorite ? (
                  'Remove from Favorites'
                ) : (
                  'Save to Favorites'
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {property && (
        <BookingModal
          open={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          onSuccess={() => {
            // Could navigate to bookings page or show success message
          }}
        />
      )}
    </Container>
  );
}

export default PropertyDetailPage;
