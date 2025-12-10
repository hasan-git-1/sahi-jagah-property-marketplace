/**
 * Test Data Factories
 * 
 * Helper functions to generate test data for unit and integration tests.
 */

import { User, UserRole } from '../../models/user.js';
import { Property, PropertyType, PropertyStatus } from '../../models/property.js';
import { Booking, BookingStatus } from '../../models/booking.js';

/**
 * Generate a test user
 */
export const createTestUser = (overrides: Partial<User> = {}): User => {
  const defaults: User = {
    id: `user_${Date.now()}_${Math.random()}`,
    name: 'Test User',
    email: 'test@example.com',
    phone: '+919876543210',
    role: 'client' as UserRole,
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

  return { ...defaults, ...overrides };
};

/**
 * Generate a test property
 */
export const createTestProperty = (overrides: Partial<Property> = {}): Property => {
  const defaults: Property = {
    id: `property_${Date.now()}_${Math.random()}`,
    title: 'Test Property',
    description: 'A beautiful test property',
    type: 'apartment' as PropertyType,
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
    status: 'active' as PropertyStatus,
    isVerified: true,
    views: 0,
    favoritesCount: 0,
    inquiriesCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...overrides };
};

/**
 * Generate a test booking
 */
export const createTestBooking = (overrides: Partial<Booking> = {}): Booking => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const defaults: Booking = {
    id: `booking_${Date.now()}_${Math.random()}`,
    propertyId: 'property123',
    clientId: 'client123',
    ownerId: 'owner123',
    scheduledAt: tomorrow,
    status: 'requested' as BookingStatus,
    notes: 'Test booking',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...defaults, ...overrides };
};

/**
 * Generate multiple test users
 */
export const createTestUsers = (count: number, overrides: Partial<User> = {}): User[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestUser({
      ...overrides,
      id: `user_${i}`,
      email: `user${i}@example.com`,
      phone: `+9198765432${10 + i}`,
    })
  );
};

/**
 * Generate multiple test properties
 */
export const createTestProperties = (
  count: number,
  overrides: Partial<Property> = {}
): Property[] => {
  return Array.from({ length: count }, (_, i) =>
    createTestProperty({
      ...overrides,
      id: `property_${i}`,
      title: `Test Property ${i + 1}`,
    })
  );
};

/**
 * Generate JWT token for testing
 */
export const generateTestToken = (userId: string, role: UserRole = 'client'): string => {
  // This is a mock token for testing - in real tests, use the actual JWT service
  return `test_token_${userId}_${role}`;
};

/**
 * Generate mock request object for Express
 */
export const createMockRequest = (overrides: any = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides,
  };
};

/**
 * Generate mock response object for Express
 */
export const createMockResponse = () => {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
  };
  return res;
};

/**
 * Generate mock next function for Express
 */
export const createMockNext = () => {
  return jest.fn();
};
