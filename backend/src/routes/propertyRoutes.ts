import { Router } from 'express';
import { propertyController, uploadMiddleware } from '../controllers/propertyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

// Public routes
router.get('/', propertyController.listProperties.bind(propertyController));
router.get('/:id', propertyController.getProperty.bind(propertyController));

// Protected routes - require authentication
router.use(authMiddleware);

// Owner/Agent only routes
router.post(
  '/',
  rbacMiddleware(['owner', 'agent']),
  propertyController.createProperty.bind(propertyController)
);

router.put('/:id', propertyController.updateProperty.bind(propertyController));
router.delete('/:id', propertyController.deleteProperty.bind(propertyController));

router.post(
  '/:id/media',
  uploadMiddleware,
  propertyController.uploadMedia.bind(propertyController)
);

export default router;
