import api from './api';
import { database } from '../config/firebase';
import { ref, onValue, off } from 'firebase/database';

export interface Conversation {
  id: string;
  participants: string[];
  propertyId?: string;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: number;
  };
  unreadCount: {
    [userId: string]: number;
  };
  createdAt: number;
  updatedAt: number;
  otherParticipant?: {
    id: string;
    name: string;
    photoURL?: string;
    role: string;
  };
  property?: {
    id: string;
    title: string;
    images: string[];
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: {
    type: 'image';
    url: string;
    thumbnailUrl?: string;
  }[];
  readBy: string[];
  createdAt: number;
}

class MessagingService {
  /**
   * Get user's conversations
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/conversations');
    return response.data.data;
  }

  /**
   * Create or get conversation
   */
  async createConversation(otherUserId: string, propertyId?: string): Promise<Conversation> {
    const response = await api.post('/conversations', {
      otherUserId,
      propertyId,
    });
    return response.data.data;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await api.get(`/conversations/${conversationId}`);
    return response.data.data;
  }

  /**
   * Send message
   */
  async sendMessage(
    conversationId: string,
    text: string,
    attachments?: File[]
  ): Promise<Message> {
    const formData = new FormData();
    formData.append('text', text);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(`/conversations/${conversationId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  /**
   * Get messages in conversation
   */
  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    const response = await api.get(`/conversations/${conversationId}/messages`, {
      params: { limit },
    });
    return response.data.data;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    await api.put(`/conversations/${conversationId}/read`);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/conversations/unread/count');
    return response.data.data.count;
  }

  /**
   * Subscribe to conversation updates (real-time)
   */
  subscribeToConversation(conversationId: string, callback: (conversation: Conversation) => void) {
    const conversationRef = ref(database, `conversations/${conversationId}`);
    onValue(conversationRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });

    return () => off(conversationRef);
  }

  /**
   * Subscribe to messages (real-time)
   */
  subscribeToMessages(conversationId: string, callback: (messages: Message[]) => void) {
    const messagesRef = ref(database, `messages/${conversationId}`);
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messagesObj = snapshot.val();
        const messages = Object.values(messagesObj) as Message[];
        messages.sort((a, b) => a.createdAt - b.createdAt);
        callback(messages);
      } else {
        callback([]);
      }
    });

    return () => off(messagesRef);
  }
}

export const messagingService = new MessagingService();
