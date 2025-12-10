import { db } from '../config/firebase';
import { Notification, NotificationType } from '../models/notification';
import { sendEmail } from '../config/email';
import { sendSMS } from '../config/sms';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
  private notificationsCollection = db.collection('notifications');
  private usersCollection = db.collection('users');

  /**
   * Create in-app notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: Date.now(),
    };

    await this.notificationsCollection.doc(notification.id).set(notification);
    return notification;
  }

  /**
   * Send notification through all enabled channels
   */
  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    options?: {
      email?: { subject?: string; html?: string };
      sms?: { message?: string };
    }
  ): Promise<void> {
    // Create in-app notification
    await this.createNotification(userId, type, title, message, data);

    // Get user preferences
    const userDoc = await this.usersCollection.doc(userId).get();
    if (!userDoc.exists) return;

    const userData = userDoc.data();
    const preferences = userData?.notificationPreferences || {};

    // Map notification type to preference key
    const preferenceKey = this.getPreferenceKey(type);

    // Send email if enabled
    if (preferences.email?.[preferenceKey] && userData?.email) {
      try {
        await sendEmail({
          to: userData.email,
          subject: options?.email?.subject || title,
          html: options?.email?.html || `<p>${message}</p>`,
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    // Send SMS if enabled
    if (preferences.sms?.[preferenceKey] && userData?.phone) {
      try {
        await sendSMS(userData.phone, options?.sms?.message || message);
      } catch (error) {
        console.error('Failed to send SMS notification:', error);
      }
    }

    // Push notifications would go here (Firebase Cloud Messaging)
    // if (preferences.push?.[preferenceKey]) {
    //   await this.sendPushNotification(userId, title, message);
    // }
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    let query = this.notificationsCollection
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (unreadOnly) {
      query = query.where('read', '==', false) as any;
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data() as Notification);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationsCollection.doc(notificationId).update({
      read: true,
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    const snapshot = await this.notificationsCollection
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const snapshot = await this.notificationsCollection
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();

    return snapshot.size;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationsCollection.doc(notificationId).delete();
  }

  /**
   * Delete old notifications (older than 30 days)
   */
  async cleanupOldNotifications(): Promise<void> {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const snapshot = await this.notificationsCollection
      .where('createdAt', '<', thirtyDaysAgo)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }

  /**
   * Helper: Map notification type to preference key
   */
  private getPreferenceKey(type: NotificationType): string {
    switch (type) {
      case 'booking':
        return 'bookings';
      case 'message':
        return 'messages';
      case 'property':
      case 'verification':
        return 'propertyUpdates';
      default:
        return 'bookings';
    }
  }

  /**
   * Send booking notification
   */
  async sendBookingNotification(
    userId: string,
    action: 'created' | 'confirmed' | 'cancelled',
    bookingDetails: {
      propertyTitle: string;
      scheduledDate: string;
      clientName?: string;
      ownerName?: string;
    }
  ): Promise<void> {
    const titles = {
      created: 'New Booking Request',
      confirmed: 'Booking Confirmed',
      cancelled: 'Booking Cancelled',
    };

    const messages = {
      created: `You have a new booking request for ${bookingDetails.propertyTitle} from ${bookingDetails.clientName} on ${new Date(bookingDetails.scheduledDate).toLocaleDateString()}.`,
      confirmed: `Your booking for ${bookingDetails.propertyTitle} on ${new Date(bookingDetails.scheduledDate).toLocaleDateString()} has been confirmed.`,
      cancelled: `Your booking for ${bookingDetails.propertyTitle} on ${new Date(bookingDetails.scheduledDate).toLocaleDateString()} has been cancelled.`,
    };

    await this.sendNotification(userId, 'booking', titles[action], messages[action], {
      propertyTitle: bookingDetails.propertyTitle,
      scheduledDate: bookingDetails.scheduledDate,
    });
  }

  /**
   * Send message notification
   */
  async sendMessageNotification(
    userId: string,
    senderName: string,
    messagePreview: string,
    conversationId: string
  ): Promise<void> {
    await this.sendNotification(
      userId,
      'message',
      `New message from ${senderName}`,
      messagePreview,
      { conversationId }
    );
  }

  /**
   * Send property notification
   */
  async sendPropertyNotification(
    userId: string,
    action: 'verified' | 'rejected' | 'inquiry',
    propertyTitle: string,
    details?: string
  ): Promise<void> {
    const titles = {
      verified: 'Property Verified',
      rejected: 'Property Verification Failed',
      inquiry: 'New Property Inquiry',
    };

    const messages = {
      verified: `Your property "${propertyTitle}" has been verified and is now live.`,
      rejected: `Your property "${propertyTitle}" verification was rejected. ${details || ''}`,
      inquiry: `You have a new inquiry for "${propertyTitle}".`,
    };

    await this.sendNotification(userId, 'property', titles[action], messages[action], {
      propertyTitle,
    });
  }
}

export const notificationService = new NotificationService();
