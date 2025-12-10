/**
 * Jest Test Setup
 * 
 * This file runs before all tests to set up the test environment.
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing-only';

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  auth: jest.fn(() => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByPhoneNumber: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    verifyIdToken: jest.fn(),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(),
    doc: jest.fn(),
    batch: jest.fn(),
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn(),
  })),
  database: jest.fn(() => ({
    ref: jest.fn(),
  })),
}));

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

// Mock Algolia
jest.mock('algoliasearch', () => {
  return jest.fn(() => ({
    initIndex: jest.fn(() => ({
      saveObject: jest.fn(),
      deleteObject: jest.fn(),
      search: jest.fn(),
    })),
  }));
});

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

// Mock Twilio
jest.mock('twilio', () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn(),
    },
  }));
});

// Increase timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress error logs in tests
  warn: jest.fn(), // Suppress warning logs in tests
};
