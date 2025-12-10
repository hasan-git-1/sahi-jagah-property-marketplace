import { database } from '../config/firebase';
import { firestore } from '../config/firebase';
import { Conversation, Message, ConversationWithDetails } from '../models/conversation';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../config/cloudinary';

export class MessagingService {
  private conversationsRef = database.ref('conversations');
  private messagesRef = database.ref('messages');

  /**
   * Create or get existing conversation between two users
   */
  async createConversation(
    userId1: string,
    userId2: string,
    propertyId?: string
  ): Promise<Conversation> {
    // Check if conversation already exists
    const existingConversation = await this.findConversation(userId1, userId2, propertyId);
    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const conversationId = uuidv4();
    const conversation: Conversation = {
      id: conversationId,
      participants: [userId1, userId2],
      propertyId,
      unreadCount: {
        [userId1]: 0,
        [userId2]: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.conversationsRef.child(conversationId).set(conversation);
    return conversation;
  }

  /**
   * Find existing conversation between users
   */
  async findConversation(
    userId1: string,
    userId2: string,
    propertyId?: string
  ): Promise<Conversation | null> {
    const snapshot = await this.conversationsRef
      .orderByChild('participants')
      .once('value');

    const conversations: Conversation[] = [];
    snapshot.forEach((child) => {
      conversations.push(child.val());
    });

    // Filter conversations that include both users
    const filtered = conversations.filter((conv) => {
      const hasUsers = conv.participants.includes(userId1) && conv.participants.includes(userId2);
      if (propertyId) {
        return hasUsers && conv.propertyId === propertyId;
      }
      return hasUsers;
    });

    return filtered[0] || null;
  }

  /**
   * Get user's conversations with details
   */
  async getUserConversations(userId: string): Promise<ConversationWithDetails[]> {
    const snapshot = await this.conversationsRef
      .orderByChild('updatedAt')
      .once('value');

    const conversations: Conversation[] = [];
    snapshot.forEach((child) => {
      const conv = child.val();
      if (conv.participants.includes(userId)) {
        conversations.push(conv);
      }
    });

    // Sort by most recent
    conversations.sort((a, b) => b.updatedAt - a.updatedAt);

    // Enrich with user and property details
    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participants.find((id) => id !== userId);
        const enrichedConv: ConversationWithDetails = { ...conv };

        // Get other participant details
        if (otherUserId) {
          try {
            const userDoc = await firestore.collection('users').doc(otherUserId).get();
            if (userDoc.exists) {
              const userData = userDoc.data();
              enrichedConv.otherParticipant = {
                id: otherUserId,
                name: userData?.name || 'Unknown User',
                photoURL: userData?.photoURL,
                role: userData?.role || 'client',
              };
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        }

        // Get property details if exists
        if (conv.propertyId) {
          try {
            const propertyDoc = await firestore
              .collection('properties')
              .doc(conv.propertyId)
              .get();
            if (propertyDoc.exists) {
              const propertyData = propertyDoc.data();
              enrichedConv.property = {
                id: conv.propertyId,
                title: propertyData?.title || 'Property',
                images: propertyData?.images || [],
              };
            }
          } catch (error) {
            console.error('Error fetching property details:', error);
          }
        }

        return enrichedConv;
      })
    );

    return enriched;
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const snapshot = await this.conversationsRef.child(conversationId).once('value');
    return snapshot.exists() ? snapshot.val() : null;
  }

  /**
   * Send message in conversation
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    text: string,
    attachments?: Express.Multer.File[]
  ): Promise<Message> {
    // Verify conversation exists
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verify sender is participant
    if (!conversation.participants.includes(senderId)) {
      throw new Error('User is not a participant in this conversation');
    }

    // Upload attachments if any
    let attachmentData: Message['attachments'] = undefined;
    if (attachments && attachments.length > 0) {
      attachmentData = await Promise.all(
        attachments.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer, {
            folder: 'messages',
            resource_type: 'image',
            transformation: [{ width: 800, height: 800, crop: 'limit' }],
          });

          return {
            type: 'image' as const,
            url: result.secure_url,
            thumbnailUrl: result.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
          };
        })
      );
    }

    // Create message
    const messageId = uuidv4();
    const message: Message = {
      id: messageId,
      conversationId,
      senderId,
      text,
      attachments: attachmentData,
      readBy: [senderId], // Sender has read their own message
      createdAt: Date.now(),
    };

    // Save message
    await this.messagesRef.child(conversationId).child(messageId).set(message);

    // Update conversation
    const otherParticipantId = conversation.participants.find((id) => id !== senderId);
    const updates: Partial<Conversation> = {
      lastMessage: {
        text: text.substring(0, 100),
        senderId,
        timestamp: message.createdAt,
      },
      updatedAt: Date.now(),
      unreadCount: {
        ...conversation.unreadCount,
        [otherParticipantId!]: (conversation.unreadCount[otherParticipantId!] || 0) + 1,
      },
    };

    await this.conversationsRef.child(conversationId).update(updates);

    return message;
  }

  /**
   * Get messages in conversation
   */
  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    const snapshot = await this.messagesRef
      .child(conversationId)
      .orderByChild('createdAt')
      .limitToLast(limit)
      .once('value');

    const messages: Message[] = [];
    snapshot.forEach((child) => {
      messages.push(child.val());
    });

    return messages;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Verify user is participant
    if (!conversation.participants.includes(userId)) {
      throw new Error('User is not a participant in this conversation');
    }

    // Get all unread messages
    const messages = await this.getMessages(conversationId);
    const unreadMessages = messages.filter((msg) => !msg.readBy.includes(userId));

    // Update each message
    const updates: { [key: string]: any } = {};
    unreadMessages.forEach((msg) => {
      updates[`${conversationId}/${msg.id}/readBy`] = [...msg.readBy, userId];
    });

    if (Object.keys(updates).length > 0) {
      await this.messagesRef.update(updates);
    }

    // Reset unread count for user
    await this.conversationsRef.child(conversationId).update({
      [`unreadCount/${userId}`]: 0,
    });
  }

  /**
   * Get total unread count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await this.getUserConversations(userId);
    return conversations.reduce((total, conv) => {
      return total + (conv.unreadCount[userId] || 0);
    }, 0);
  }
}

export const messagingService = new MessagingService();
