/**
 * Header Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../helpers/testUtils';
import Header from '../../components/Header';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Header Component', () => {
  it('should render logo and navigation', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/Sahi Jagah/i)).toBeInTheDocument();
  });

  it('should show login/signup buttons when not authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  it('should show user menu when authenticated', () => {
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
  });

  it('should show role-based navigation for client', () => {
    (useAuthStore as any).mockReturnValue({
      user: { ...mockUser, role: 'client' },
      isAuthenticated: true,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
  });

  it('should show role-based navigation for owner', () => {
    (useAuthStore as any).mockReturnValue({
      user: { ...mockUser, role: 'owner' },
      isAuthenticated: true,
    });

    renderWithProviders(<Header />);

    expect(screen.getByText(/My Properties/i)).toBeInTheDocument();
  });
});
