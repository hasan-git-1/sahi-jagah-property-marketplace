export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  propertyId?: string; // Optional property context
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
  readBy: string[]; // Array of user IDs who have read the message
  createdAt: number;
}

export interface ConversationWithDetails extends Conversation {
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
