/**
 * Document Routes
 */

import { Router } from 'express';
import multer from 'multer';
import { documentController } from '../controllers/documentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { rbacMiddleware } from '../middlewares/rbacMiddleware.js';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG are allowed.'));
    }
  },
});

// Property document routes
router.post(
  '/properties/:propertyId/documents',
  authMiddleware,
  rbacMiddleware(['owner', 'agent']),
  upload.single('file'),
  documentController.uploadDocument.bind(documentController)
);

router.get(
  '/properties/:propertyId/documents',
  authMiddleware,
  documentController.getPropertyDocuments.bind(documentController)
);

// Document routes
router.get(
  '/documents/:id',
  authMiddleware,
  documentController.getDocument.bind(documentController)
);

router.delete(
  '/documents/:id',
  authMiddleware,
  rbacMiddleware(['owner', 'agent']),
  documentController.deleteDocument.bind(documentController)
);

// Admin verification routes
router.get(
  '/admin/verification/pending',
  authMiddleware,
  rbacMiddleware(['admin']),
  documentController.getPendingDocuments.bind(documentController)
);

router.put(
  '/admin/verification/:id/approve',
  authMiddleware,
  rbacMiddleware(['admin']),
  documentController.approveDocument.bind(documentController)
);

router.put(
  '/admin/verification/:id/reject',
  authMiddleware,
  rbacMiddleware(['admin']),
  documentController.rejectDocument.bind(documentController)
);

export default router;
