import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(rbacMiddleware(['admin']));

// Dashboard and analytics
router.get('/dashboard', adminController.getDashboard.bind(adminController));
router.get('/analytics', adminController.getAnalytics.bind(adminController));

// User management
router.get('/users', adminController.getUsers.bind(adminController));
router.put('/users/:id/status', adminController.updateUserStatus.bind(adminController));

// Property management
router.get('/properties', adminController.getProperties.bind(adminController));
router.put('/properties/:id/verify', adminController.verifyProperty.bind(adminController));

export default router;
