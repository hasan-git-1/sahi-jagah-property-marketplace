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

export type NotificationType = Notification['type'];

export interface NotificationPreferences {
  email: {
    bookings: boolean;
    messages: boolean;
    propertyUpdates: boolean;
    marketing: boolean;
  };
  sms: {
    bookings: boolean;
    messages: boolean;
  };
  push: {
    bookings: boolean;
    messages: boolean;
    propertyUpdates: boolean;
  };
}
