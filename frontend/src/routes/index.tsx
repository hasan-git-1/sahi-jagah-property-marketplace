import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ProfilePage from '@/pages/ProfilePage';
import { DashboardPage } from '@/pages/DashboardPage';
import PropertyListPage from '@/pages/properties/PropertyListPage';
import PropertyDetailPage from '@/pages/properties/PropertyDetailPage';
import CreatePropertyPage from '@/pages/properties/CreatePropertyPage';
import SearchPage from '@/pages/SearchPage';
import FavoritesPage from '@/pages/FavoritesPage';
import BookingsPage from '@/pages/BookingsPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/properties" element={<PropertyListPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route
        path="/properties/create"
        element={
          <ProtectedRoute allowedRoles={['owner', 'agent']}>
            <CreatePropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
