import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AppError } from '../middlewares/errorHandler';

export class AuthController {
  // Signup
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, password, role } = req.body;

      // Validate required fields
      if (!name || !role) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Name and role are required');
      }

      if (!['owner', 'client', 'agent', 'admin'].includes(role)) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Invalid role');
      }

      const result = await authService.signup({
        name,
        email,
        phone,
        password,
        role,
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            role: result.user.role,
            isVerified: result.user.isVerified,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, password, otp } = req.body;

      const result = await authService.login({
        email,
        phone,
        password,
        otp,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            role: result.user.role,
            isVerified: result.user.isVerified,
            profilePhotoUrl: result.user.profilePhotoUrl,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Send OTP
  async sendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;

      if (!phone) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Phone number is required');
      }

      await authService.sendOTP(phone);

      res.json({
        success: true,
        data: {
          message: 'OTP sent successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify OTP
  async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;

      if (!phone || !otp) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Phone and OTP are required');
      }

      const isValid = await authService.verifyOTP(phone, otp);

      if (!isValid) {
        throw new AppError(401, 'AUTH_OTP_INVALID', 'Invalid or expired OTP');
      }

      res.json({
        success: true,
        data: {
          message: 'OTP verified successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Refresh token is required');
      }

      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        throw new AppError(400, 'VALIDATION_FAILED', 'Token is required');
      }

      await authService.logout(token);

      res.json({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
