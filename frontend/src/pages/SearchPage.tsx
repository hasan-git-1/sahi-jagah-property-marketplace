import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Search, Bed, Bathtub, SquareFoot } from '@mui/icons-material';
import api from '@/services/api';

interface Property {
  objectID: string;
  title: string;
  type: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  city: string;
  state: string;
  primaryPhotoUrl: string;
}

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (city) params.append('city', city);
      if (type) params.append('type', type);

      const response = await api.get(`/search?${params.toString()}`);
      setProperties(response.data.data.hits);
      setTotalResults(response.data.data.nbHits);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search properties..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Hyderabad"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="rent">Rent</MenuItem>
                    <MenuItem value="sale">Sale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button type="submit" variant="contained" fullWidth size="large">
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {totalResults} properties found
            </Typography>

            <Grid container spacing={3}>
              {properties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.objectID}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={property.primaryPhotoUrl || 'https://via.placeholder.com/400x300'}
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
                        {property.city}, {property.state}
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
                      <Button
                        size="small"
                        onClick={() => navigate(`/properties/${property.objectID}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {properties.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No properties found matching your search
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default SearchPage;
