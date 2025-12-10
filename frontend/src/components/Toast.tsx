import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { create } from 'zustand';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
  showToast: (message: string, severity?: AlertColor) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  open: false,
  message: '',
  severity: 'info',
  showToast: (message, severity = 'info') =>
    set({ open: true, message, severity }),
  hideToast: () => set({ open: false }),
}));

export const Toast: React.FC = () => {
  const { open, message, severity, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={hideToast} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// Helper functions for easy toast usage
export const toast = {
  success: (message: string) => useToastStore.getState().showToast(message, 'success'),
  error: (message: string) => useToastStore.getState().showToast(message, 'error'),
  warning: (message: string) => useToastStore.getState().showToast(message, 'warning'),
  info: (message: string) => useToastStore.getState().showToast(message, 'info'),
};
