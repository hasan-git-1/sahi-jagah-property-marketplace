import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const footerLinks = {
    'For Buyers': [
      { label: 'Search Properties', path: '/search' },
      { label: 'Browse Listings', path: '/properties' },
      { label: 'Saved Favorites', path: '/favorites' },
      { label: 'My Bookings', path: '/bookings' },
    ],
    'For Owners': [
      { label: 'List Property', path: '/properties/create' },
      { label: 'My Properties', path: '/properties' },
      { label: 'Manage Bookings', path: '/bookings' },
      { label: 'Messages', path: '/messages' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'white',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Sahi Jagah
            </Typography>
            <Typography variant="body2" color="grey.400" paragraph>
              Find your perfect property in tier-2 and tier-3 cities of India. Connecting
              property owners with genuine buyers and tenants.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton
                size="small"
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                href="https://facebook.com"
                target="_blank"
              >
                <Facebook />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                href="https://twitter.com"
                target="_blank"
              >
                <Twitter />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                href="https://instagram.com"
                target="_blank"
              >
                <Instagram />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
                href="https://linkedin.com"
                target="_blank"
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2.66} key={title}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {links.map((link) => (
                  <Link
                    key={link.path}
                    component="button"
                    variant="body2"
                    onClick={() => navigate(link.path)}
                    sx={{
                      color: 'grey.400',
                      textDecoration: 'none',
                      textAlign: 'left',
                      '&:hover': {
                        color: 'white',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'grey.800' }} />

        {/* Contact Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Phone fontSize="small" />
              <Typography variant="body2" color="grey.400">
                +91 7093187420
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Email fontSize="small" />
              <Typography variant="body2" color="grey.400">
                support@sahijagah.com
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <LocationOn fontSize="small" />
              <Typography variant="body2" color="grey.400">
                Hyderabad, Telangana, India
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: 'grey.800' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} Sahi Jagah. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
