import { Router } from 'express';
import { DataPrivacyController } from '../controllers/dataPrivacyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { auditLog } from '../middlewares/auditLog';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Export user data
router.get('/export', auditLog('user.export'), DataPrivacyController.exportData);

// Delete user account
router.delete('/account', auditLog('user.delete'), DataPrivacyController.deleteAccount);

export default router;
