import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

export class NotificationController {
  /**
   * Get user's notifications
   * GET /api/v1/notifications
   */
  async getNotifications(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const limit = parseInt(req.query.limit as string) || 50;
      const unreadOnly = req.query.unreadOnly === 'true';

      const notifications = await notificationService.getUserNotifications(
        userId,
        limit,
        unreadOnly
      );

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error: any) {
      console.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications',
        error: error.message,
      });
    }
  }

  /**
   * Get unread count
   * GET /api/v1/notifications/unread/count
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.getUnreadCount(userId);

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

  /**
   * Mark notification as read
   * PUT /api/v1/notifications/:id/read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id);

      res.json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error: any) {
      console.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message,
      });
    }
  }

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/read-all
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read',
        error: error.message,
      });
    }
  }

  /**
   * Delete notification
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await notificationService.deleteNotification(id);

      res.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error: any) {
      console.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message,
      });
    }
  }
}

export const notificationController = new NotificationController();
