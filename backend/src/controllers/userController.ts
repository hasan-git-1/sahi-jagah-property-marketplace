import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { AppError } from '../middlewares/errorHandler';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Users can only view their own profile unless admin
      if (req.user?.userId !== id && req.user?.role !== 'admin') {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'Cannot access this user profile');
      }

      const user = await userService.getUserById(id);

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePhotoUrl: user.profilePhotoUrl,
          isVerified: user.isVerified,
          preferences: user.preferences,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Users can only update their own profile unless admin
      if (req.user?.userId !== id && req.user?.role !== 'admin') {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'Cannot update this user profile');
      }

      const updates = req.body;
      const user = await userService.updateUser(id, updates);

      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          profilePhotoUrl: user.profilePhotoUrl,
          isVerified: user.isVerified,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Users can only delete their own account unless admin
      if (req.user?.userId !== id && req.user?.role !== 'admin') {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'Cannot delete this user account');
      }

      await userService.deleteUser(id);

      res.json({
        success: true,
        data: {
          message: 'User account deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfilePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (req.user?.userId !== id) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'Cannot update this user profile');
      }

      if (!req.file) {
        throw new AppError(400, 'VALIDATION_FAILED', 'No file uploaded');
      }

      const photoUrl = await userService.uploadProfilePhoto(id, req.file);

      res.json({
        success: true,
        data: {
          profilePhotoUrl: photoUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNotificationPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (req.user?.userId !== id) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'Cannot update this user preferences');
      }

      const { emailNotifications, smsNotifications, pushNotifications } = req.body;

      await userService.updateNotificationPreferences(id, {
        emailNotifications,
        smsNotifications,
        pushNotifications,
      });

      res.json({
        success: true,
        data: {
          message: 'Notification preferences updated successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
export const uploadMiddleware = upload.single('photo');
