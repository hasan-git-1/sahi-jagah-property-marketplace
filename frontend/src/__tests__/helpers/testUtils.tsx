/**
 * Test Utilities
 * 
 * Helper functions for testing React components.
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Create a new QueryClient for each test
 */
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

/**
 * Wrapper component with all providers
 */
interface AllProvidersProps {
  children: React.ReactNode;
}

export const AllProviders = ({ children }: AllProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Custom render function with providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+919876543210',
  role: 'client' as const,
  isEmailVerified: true,
  isPhoneVerified: true,
  profilePhoto: null,
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock property data
 */
export const mockProperty = {
  id: 'property123',
  title: 'Test Property',
  description: 'A beautiful test property',
  type: 'apartment' as const,
  price: 15000,
  city: 'Hyderabad',
  location: {
    address: '123 Test Street',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    coordinates: {
      lat: 17.385,
      lng: 78.4867,
    },
  },
  bedrooms: 2,
  bathrooms: 2,
  area: 1200,
  amenities: ['parking', 'wifi', 'gym'],
  images: ['https://example.com/image1.jpg'],
  videos: [],
  ownerId: 'owner123',
  status: 'active' as const,
  isVerified: true,
  views: 0,
  favoritesCount: 0,
  inquiriesCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock booking data
 */
export const mockBooking = {
  id: 'booking123',
  propertyId: 'property123',
  clientId: 'client123',
  ownerId: 'owner123',
  scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  status: 'requested' as const,
  notes: 'Test booking',
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Wait for async updates
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
