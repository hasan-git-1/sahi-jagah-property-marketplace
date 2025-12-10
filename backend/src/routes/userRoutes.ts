import { Router } from 'express';
import { userController, uploadMiddleware } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/:id', userController.getUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));
router.post(
  '/:id/photo',
  uploadMiddleware,
  userController.uploadProfilePhoto.bind(userController)
);
router.put(
  '/:id/preferences',
  userController.updateNotificationPreferences.bind(userController)
);

export default router;
