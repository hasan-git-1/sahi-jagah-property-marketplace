import { Request, Response } from 'express';
import { messagingService } from '../services/messagingService';
import { z } from 'zod';

// Validation schemas
const createConversationSchema = z.object({
  otherUserId: z.string().min(1),
  propertyId: z.string().optional(),
});

const sendMessageSchema = z.object({
  text: z.string().min(1).max(5000),
});

export class MessagingController {
  /**
   * Get user's conversations
   * GET /api/v1/conversations
   */
  async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const conversations = await messagingService.getUserConversations(userId);

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      console.error('Get conversations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch conversations',
        error: error.message,
      });
    }
  }

  /**
   * Create or get conversation
   * POST /api/v1/conversations
   */
  async createConversation(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const validation = createConversationSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { otherUserId, propertyId } = validation.data;

      // Prevent creating conversation with self
      if (userId === otherUserId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot create conversation with yourself',
        });
      }

      const conversation = await messagingService.createConversation(
        userId,
        otherUserId,
        propertyId
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error: any) {
      console.error('Create conversation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create conversation',
        error: error.message,
      });
    }
  }

  /**
   * Get conversation by ID
   * GET /api/v1/conversations/:id
   */
  async getConversation(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const conversation = await messagingService.getConversation(id);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }

      // Verify user is participant
      if (!conversation.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error: any) {
      console.error('Get conversation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch conversation',
        error: error.message,
      });
    }
  }

  /**
   * Send message
   * POST /api/v1/conversations/:id/messages
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const validation = sendMessageSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { text } = validation.data;
      const attachments = req.files as Express.Multer.File[] | undefined;

      const message = await messagingService.sendMessage(id, userId, text, attachments);

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error: any) {
      console.error('Send message error:', error);
      const status = error.message.includes('not found') ? 404 : 
                     error.message.includes('not a participant') ? 403 : 500;
      res.status(status).json({
        success: false,
        message: 'Failed to send message',
        error: error.message,
      });
    }
  }

  /**
   * Get messages in conversation
   * GET /api/v1/conversations/:id/messages
   */
  async getMessages(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      // Verify user is participant
      const conversation = await messagingService.getConversation(id);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }

      if (!conversation.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      const messages = await messagingService.getMessages(id, limit);

      res.json({
        success: true,
        data: messages,
      });
    } catch (error: any) {
      console.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch messages',
        error: error.message,
      });
    }
  }

  /**
   * Mark messages as read
   * PUT /api/v1/conversations/:id/read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      await messagingService.markMessagesAsRead(id, userId);

      res.json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      const status = error.message.includes('not found') ? 404 : 
                     error.message.includes('not a participant') ? 403 : 500;
      res.status(status).json({
        success: false,
        message: 'Failed to mark messages as read',
        error: error.message,
      });
    }
  }

  /**
   * Get unread count
   * GET /api/v1/conversations/unread/count
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const count = await messagingService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      console.error('Get unread count error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch unread count',
        error: error.message,
      });
    }
  }
}

export const messagingController = new MessagingController();
