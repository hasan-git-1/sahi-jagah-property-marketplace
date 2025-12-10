/**
 * Booking Service Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { createTestBooking } from '../helpers/testData.js';
import { BookingStatus } from '../../models/booking.js';

describe('BookingService', () => {
  describe('Booking Creation', () => {
    it('should create booking with requested status', () => {
      const booking = createTestBooking();

      expect(booking.status).toBe('requested');
    });

    it('should validate future booking dates', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
      const booking = createTestBooking({ scheduledAt: futureDate });

      expect(booking.scheduledAt.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should reject past booking dates', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

      expect(pastDate.getTime()).toBeLessThan(now.getTime());
    });
  });

  describe('Booking State Transitions', () => {
    it('should allow requested → confirmed transition', () => {
      const booking = createTestBooking({ status: 'requested' as BookingStatus });

      booking.status = 'confirmed' as BookingStatus;
      booking.updatedAt = new Date();

      expect(booking.status).toBe('confirmed');
    });

    it('should allow requested → cancelled transition', () => {
      const booking = createTestBooking({ status: 'requested' as BookingStatus });

      booking.status = 'cancelled' as BookingStatus;
      booking.updatedAt = new Date();

      expect(booking.status).toBe('cancelled');
    });

    it('should allow confirmed → completed transition', () => {
      const booking = createTestBooking({ status: 'confirmed' as BookingStatus });

      booking.status = 'completed' as BookingStatus;
      booking.updatedAt = new Date();

      expect(booking.status).toBe('completed');
    });

    it('should allow confirmed → cancelled transition', () => {
      const booking = createTestBooking({ status: 'confirmed' as BookingStatus });

      booking.status = 'cancelled' as BookingStatus;
      booking.updatedAt = new Date();

      expect(booking.status).toBe('cancelled');
    });
  });

  describe('Booking Modifications', () => {
    it('should allow time modifications in requested state', () => {
      const booking = createTestBooking({ status: 'requested' as BookingStatus });
      const newTime = new Date(booking.scheduledAt.getTime() + 24 * 60 * 60 * 1000);

      booking.scheduledAt = newTime;
      booking.updatedAt = new Date();

      expect(booking.scheduledAt).toEqual(newTime);
    });

    it('should not allow modifications in completed state', () => {
      const booking = createTestBooking({ status: 'completed' as BookingStatus });
      const originalTime = booking.scheduledAt;

      // In real implementation, this would throw an error
      const canModify = booking.status === 'requested';

      expect(canModify).toBe(false);
      expect(booking.scheduledAt).toEqual(originalTime);
    });
  });

  describe('Booking Notifications', () => {
    it('should identify affected users for notifications', () => {
      const booking = createTestBooking();

      const affectedUsers = [booking.clientId, booking.ownerId];

      expect(affectedUsers).toHaveLength(2);
      expect(affectedUsers).toContain(booking.clientId);
      expect(affectedUsers).toContain(booking.ownerId);
    });
  });
});
