import { db } from '../config/firebase';
import { Booking, CreateBookingDto, UpdateBookingDto } from '../models/booking';
import { Property } from '../models/property';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';
import { sendBookingConfirmationEmail } from '../config/email';
import { sendBookingNotificationSMS } from '../config/sms';
import { notificationService } from './notificationService';

export class BookingService {
  async createBooking(clientId: string, data: CreateBookingDto): Promise<Booking> {
    try {
      // Get property details
      const propertyDoc = await db.collection('properties').doc(data.propertyId).get();
      if (!propertyDoc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      const property = propertyDoc.data() as Property;

      // Validate scheduled time is in the future
      if (new Date(data.scheduledAt) <= new Date()) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Scheduled time must be in the future');
      }

      const bookingData: Omit<Booking, 'id'> = {
        propertyId: data.propertyId,
        clientId,
        ownerId: property.ownerId,
        scheduledAt: new Date(data.scheduledAt),
        status: 'requested',
        notes: data.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('bookings').add(bookingData);

      // Increment inquiries count
      await db
        .collection('properties')
        .doc(data.propertyId)
        .update({
          inquiriesCount: property.inquiriesCount + 1 || 1,
        });

      // Send notifications (async, don't wait)
      this.sendBookingNotifications(docRef.id, 'created');

      logger.info(`Booking created: ${docRef.id}`);
      return { id: docRef.id, ...bookingData };
    } catch (error) {
      logger.error('Create booking error:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: string): Promise<Booking> {
    try {
      const doc = await db.collection('bookings').doc(bookingId).get();

      if (!doc.exists) {
        throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Booking not found');
      }

      return { id: doc.id, ...doc.data() } as Booking;
    } catch (error) {
      logger.error('Get booking error:', error);
      throw error;
    }
  }

  async getUserBookings(userId: string, role: string): Promise<Booking[]> {
    try {
      let query: any = db.collection('bookings');

      if (role === 'client') {
        query = query.where('clientId', '==', userId);
      } else if (role === 'owner' || role === 'agent') {
        query = query.where('ownerId', '==', userId);
      }

      query = query.orderBy('scheduledAt', 'desc');

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Booking));
    } catch (error) {
      logger.error('Get user bookings error:', error);
      throw error;
    }
  }

  async updateBooking(
    bookingId: string,
    userId: string,
    role: string,
    updates: UpdateBookingDto
  ): Promise<Booking> {
    try {
      const bookingRef = db.collection('bookings').doc(bookingId);
      const doc = await bookingRef.get();

      if (!doc.exists) {
        throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Booking not found');
      }

      const booking = doc.data() as Booking;

      // Check permissions
      if (booking.clientId !== userId && booking.ownerId !== userId) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'You do not have access to this booking');
      }

      // Validate state transitions
      if (updates.status) {
        this.validateStatusTransition(booking.status, updates.status);
      }

      // Only owner can confirm
      if (updates.status === 'confirmed' && booking.ownerId !== userId) {
        throw new AppError(403, 'FORBIDDEN_OPERATION', 'Only the owner can confirm bookings');
      }

      // Only allow time modification in requested status
      if (updates.scheduledAt && booking.status !== 'requested') {
        throw new AppError(
          400,
          'INVALID_STATE_TRANSITION',
          'Can only modify time for requested bookings'
        );
      }

      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
      };

      if (updates.status === 'confirmed') {
        updateData.confirmedAt = new Date();
      } else if (updates.status === 'completed') {
        updateData.completedAt = new Date();
      } else if (updates.status === 'cancelled') {
        updateData.cancelledBy = userId;
      }

      await bookingRef.update(updateData);

      const updatedDoc = await bookingRef.get();
      const updatedBooking = { id: updatedDoc.id, ...updatedDoc.data() } as Booking;

      // Send notifications
      if (updates.status) {
        this.sendBookingNotifications(bookingId, updates.status);
      }

      logger.info(`Booking updated: ${bookingId}`);
      return updatedBooking;
    } catch (error) {
      logger.error('Update booking error:', error);
      throw error;
    }
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      requested: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      cancelled: [],
      completed: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new AppError(
        400,
        'INVALID_STATE_TRANSITION',
        `Cannot transition from ${currentStatus} to ${newStatus}`
      );
    }
  }

  private async sendBookingNotifications(bookingId: string, event: string): Promise<void> {
    try {
      const booking = await this.getBookingById(bookingId);
      const property = await db.collection('properties').doc(booking.propertyId).get();
      const propertyData = property.data() as Property;

      // Get user details
      const [clientDoc, ownerDoc] = await Promise.all([
        db.collection('users').doc(booking.clientId).get(),
        db.collection('users').doc(booking.ownerId).get(),
      ]);

      const client = clientDoc.data();
      const owner = ownerDoc.data();

      const scheduledTime = booking.scheduledAt.toLocaleString();

      // Send emails
      if (event === 'created' || event === 'confirmed') {
        if (client?.email) {
          await sendBookingConfirmationEmail(client.email, {
            propertyTitle: propertyData.title,
            scheduledAt: scheduledTime,
            address: `${propertyData.address.line1}, ${propertyData.address.city}`,
          });
        }
        if (owner?.email) {
          await sendBookingConfirmationEmail(owner.email, {
            propertyTitle: propertyData.title,
            scheduledAt: scheduledTime,
            address: `${propertyData.address.line1}, ${propertyData.address.city}`,
          });
        }
      }

      // Send SMS if enabled
      if (client?.preferences?.smsNotifications && client?.phone) {
        await sendBookingNotificationSMS(client.phone, propertyData.title, scheduledTime);
      }
      if (owner?.preferences?.smsNotifications && owner?.phone) {
        await sendBookingNotificationSMS(owner.phone, propertyData.title, scheduledTime);
      }
    } catch (error) {
      logger.error('Send booking notifications error:', error);
    }
  }
}

export default new BookingService();
