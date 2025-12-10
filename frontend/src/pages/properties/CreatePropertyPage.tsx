import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import api from '@/services/api';

const AMENITIES_OPTIONS = [
  'Parking',
  'Gym',
  'Swimming Pool',
  'Garden',
  'Security',
  'Power Backup',
  'Elevator',
  'Water Supply',
  'Wi-Fi',
  'Air Conditioning',
];

function CreatePropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'rent' | 'sale'>('rent');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [furnishingStatus, setFurnishingStatus] = useState('unfurnished');
  const [amenities, setAmenities] = useState<string[]>([]);

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const propertyData = {
        title,
        description,
        type,
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        area: area ? parseFloat(area) : undefined,
        furnishingStatus,
        amenities,
        address: {
          line1: addressLine1,
          line2: addressLine2,
          city,
          state,
          pincode,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      };

      const response = await api.post('/properties', propertyData);
      navigate(`/properties/${response.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          List Your Property
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Property Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select value={type} label="Type" onChange={(e: any) => setType(e.target.value)}>
                    <MenuItem value="rent">For Rent</MenuItem>
                    <MenuItem value="sale">For Sale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price (INR)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Area (sq ft)"
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </Grid>
            </Grid>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Furnishing Status</InputLabel>
              <Select
                value={furnishingStatus}
                label="Furnishing Status"
                onChange={(e) => setFurnishingStatus(e.target.value)}
              >
                <MenuItem value="furnished">Furnished</MenuItem>
                <MenuItem value="semi-furnished">Semi-Furnished</MenuItem>
                <MenuItem value="unfurnished">Unfurnished</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Amenities</InputLabel>
              <Select
                multiple
                value={amenities}
                onChange={(e) => setAmenities(e.target.value as string[])}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {AMENITIES_OPTIONS.map((amenity) => (
                  <MenuItem key={amenity} value={amenity}>
                    {amenity}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Location
            </Typography>

            <TextField
              fullWidth
              label="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Address Line 2"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Latitude"
                  type="number"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Longitude"
                  type="number"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Create Property'}
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default CreatePropertyPage;
