import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Bed, Bathtub, SquareFoot, Delete } from '@mui/icons-material';
import api from '@/services/api';

interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  address: {
    city: string;
    state: string;
  };
  photos: Array<{ url: string }>;
  status: string;
}

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data.data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await api.delete(`/favorites/${propertyId}`);
      setFavorites(favorites.filter((p) => p.id !== propertyId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
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
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Properties you've saved for later
        </Typography>

        {favorites.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No favorites yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start exploring properties and save your favorites!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/search')}>
              Search Properties
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={property.photos[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={property.title}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Typography variant="h6" gutterBottom noWrap sx={{ flex: 1 }}>
                        {property.title}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFavorite(property.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Typography variant="h5" color="primary" gutterBottom>
                      ₹{property.price.toLocaleString()}
                      {property.type === 'rent' && '/month'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {property.address.city}, {property.address.state}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      {property.bedrooms && (
                        <Chip
                          icon={<Bed />}
                          label={`${property.bedrooms} Bed`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {property.bathrooms && (
                        <Chip
                          icon={<Bathtub />}
                          label={`${property.bathrooms} Bath`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {property.area && (
                        <Chip
                          icon={<SquareFoot />}
                          label={`${property.area} sqft`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/properties/${property.id}`)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default FavoritesPage;
