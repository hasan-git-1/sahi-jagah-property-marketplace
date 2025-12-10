import { Router } from 'express';
import { messagingController } from '../controllers/messagingController';
import { authMiddleware } from '../middlewares/authMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// All routes require authentication
router.use(authMiddleware);

// Get unread count (must be before /:id routes)
router.get('/unread/count', messagingController.getUnreadCount.bind(messagingController));

// Conversation routes
router.get('/', messagingController.getConversations.bind(messagingController));
router.post('/', messagingController.createConversation.bind(messagingController));
router.get('/:id', messagingController.getConversation.bind(messagingController));

// Message routes
router.get('/:id/messages', messagingController.getMessages.bind(messagingController));
router.post(
  '/:id/messages',
  upload.array('attachments', 5),
  messagingController.sendMessage.bind(messagingController)
);
router.put('/:id/read', messagingController.markAsRead.bind(messagingController));

export default router;
