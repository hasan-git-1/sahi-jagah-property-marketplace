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
} from '@mui/material';
import { Bed, Bathtub, SquareFoot } from '@mui/icons-material';
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

function PropertyListPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.get('/properties?status=active&limit=20');
      setProperties(response.data.data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Properties</Typography>
          <Button variant="contained" onClick={() => navigate('/properties/create')}>
            List Property
          </Button>
        </Box>

        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.photos[0]?.url || 'https://via.placeholder.com/400x300'}
                  alt={property.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom noWrap>
                    {property.title}
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    ₹{property.price.toLocaleString()}
                    {property.type === 'rent' && '/month'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {property.address.city}, {property.address.state}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
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

        {properties.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No properties found
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default PropertyListPage;
