import api from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'property' | 'verification' | 'system';
  title: string;
  message: string;
  data?: {
    propertyId?: string;
    bookingId?: string;
    conversationId?: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: number;
}

class NotificationService {
  /**
   * Get user's notifications
   */
  async getNotifications(limit: number = 50, unreadOnly: boolean = false): Promise<Notification[]> {
    const response = await api.get('/notifications', {
      params: { limit, unreadOnly },
    });
    return response.data.data;
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread/count');
    return response.data.data.count;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await api.put(`/notifications/${notificationId}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService();
