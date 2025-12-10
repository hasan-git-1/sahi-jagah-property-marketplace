import { Router } from 'express';
import authController from '../controllers/authController';
import { authLimiter, otpLimiter } from '../middlewares/rateLimitMiddleware';

const router = Router();

// Public routes with rate limiting
router.post('/signup', authLimiter, authController.signup.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.post('/otp/send', otpLimiter, authController.sendOTP.bind(authController));
router.post('/otp/verify', authLimiter, authController.verifyOTP.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;
