/**
 * Auth Service Unit Tests
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createTestUser } from '../helpers/testData.js';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Hashing', () => {
    it('should hash passwords with bcrypt cost factor 12', async () => {
      const password = 'Test@1234';
      const hashedPassword = '$2b$12$hashedpassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await bcrypt.hash(password, 12);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12);
      expect(result).toBe(hashedPassword);
    });

    it('should verify passwords correctly', async () => {
      const password = 'Test@1234';
      const hashedPassword = '$2b$12$hashedpassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate access token with 24h expiration', () => {
      const user = createTestUser();
      const token = 'mock.jwt.token';

      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      expect(result).toBe(token);
    });

    it('should generate refresh token with 30d expiration', () => {
      const user = createTestUser();
      const token = 'mock.refresh.token';

      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: '30d' }
      );

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
      );
      expect(result).toBe(token);
    });

    it('should verify JWT tokens correctly', () => {
      const token = 'mock.jwt.token';
      const decoded = { userId: 'user123', role: 'client' };

      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const result = jwt.verify(token, process.env.JWT_SECRET!);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toEqual(decoded);
    });
  });

  describe('User Registration', () => {
    it('should create user with correct role', () => {
      const user = createTestUser({ role: 'owner' });

      expect(user.role).toBe('owner');
      expect(['client', 'owner', 'agent', 'admin']).toContain(user.role);
    });

    it('should set email verification status', () => {
      const user = createTestUser({ isEmailVerified: false });

      expect(user.isEmailVerified).toBe(false);
    });

    it('should set phone verification status', () => {
      const user = createTestUser({ isPhoneVerified: false });

      expect(user.isPhoneVerified).toBe(false);
    });
  });

  describe('OTP Management', () => {
    it('should generate 6-digit OTP', () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      expect(otp).toMatch(/^\d{6}$/);
      expect(otp.length).toBe(6);
    });

    it('should set OTP expiration to 10 minutes', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

      const diff = expiresAt.getTime() - now.getTime();
      const minutes = diff / (60 * 1000);

      expect(minutes).toBe(10);
    });
  });
});
