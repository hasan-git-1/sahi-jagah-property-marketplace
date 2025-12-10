import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import propertyRoutes from './propertyRoutes';
import searchRoutes from './searchRoutes';
import favoriteRoutes from './favoriteRoutes';
import bookingRoutes from './bookingRoutes';
import messagingRoutes from './messagingRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';
import dataPrivacyRoutes from './dataPrivacyRoutes';

const router = Router();

// Health check for API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      version: process.env.API_VERSION || 'v1',
      timestamp: new Date().toISOString(),
    },
  });
});

// Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/search', searchRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/bookings', bookingRoutes);
router.use('/conversations', messagingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/privacy', dataPrivacyRoutes);
// router.use('/documents', documentRoutes);
// router.use('/leases', leaseRoutes);

export default router;
