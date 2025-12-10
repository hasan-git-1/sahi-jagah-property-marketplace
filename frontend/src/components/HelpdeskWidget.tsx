import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Help, Close, Phone, Message, Email } from '@mui/icons-material';

export const HelpdeskWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCall = () => {
    window.location.href = 'tel:+917093187420';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:support@sahijagah.com';
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="help"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Help />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Need Help?</Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our support team is here to help you. Choose how you'd like to reach us:
          </Typography>

          <List>
            <ListItem
              button
              onClick={handleCall}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <Phone color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Call Us"
                secondary="+91 7093187420"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={handleEmail}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email Us"
                secondary="support@sahijagah.com"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                handleClose();
                window.location.href = '/messages';
              }}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <ListItemIcon>
                <Message color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Chat with Us"
                secondary="Send us a message"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Support Hours:</strong>
              <br />
              Monday - Saturday: 9:00 AM - 6:00 PM IST
              <br />
              Sunday: Closed
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
