import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get unread count (must be before /:id routes)
router.get('/unread/count', notificationController.getUnreadCount.bind(notificationController));

// Mark all as read (must be before /:id routes)
router.put('/read-all', notificationController.markAllAsRead.bind(notificationController));

// Notification routes
router.get('/', notificationController.getNotifications.bind(notificationController));
router.put('/:id/read', notificationController.markAsRead.bind(notificationController));
router.delete('/:id', notificationController.deleteNotification.bind(notificationController));

export default router;
