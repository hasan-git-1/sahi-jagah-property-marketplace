import React from 'react';
import { useAuthStore } from '../store/authStore';
import { OwnerDashboard } from './dashboards/OwnerDashboard';
import { ClientDashboard } from './dashboards/ClientDashboard';
import { Navigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'owner':
    case 'agent':
      return <OwnerDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <ClientDashboard />;
  }
};
