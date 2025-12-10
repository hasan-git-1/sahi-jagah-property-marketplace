import { Container, Typography, Box } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Sahi Jagah
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your trusted property marketplace for tier-2 and tier-3 cities
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;
