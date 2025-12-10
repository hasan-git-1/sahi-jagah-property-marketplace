import { db } from '../config/firebase';
import { User } from '../models/user';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';
import cloudinary from '../config/cloudinary';

export class UserService {
  async getUserById(userId: string): Promise<User> {
    try {
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
      }

      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
      }

      // Don't allow updating sensitive fields
      const { id, hashedPassword, createdAt, ...allowedUpdates } = updates as any;

      await userRef.update({
        ...allowedUpdates,
        updatedAt: new Date(),
      });

      const updatedDoc = await userRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as User;
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
      }

      // Soft delete - anonymize data
      await userRef.update({
        status: 'deleted',
        email: null,
        phone: null,
        name: 'Deleted User',
        profilePhotoUrl: null,
        updatedAt: new Date(),
      });

      logger.info(`User ${userId} deleted (anonymized)`);
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error;
    }
  }

  async uploadProfilePhoto(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      // Upload to Cloudinary
      const result = await new Promise<{ url: string; publicId: string }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `users/${userId}`,
              resource_type: 'image',
              transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto' },
              ],
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve({ url: result.secure_url, publicId: result.public_id });
            }
          )
          .end(file.buffer);
      });

      // Update user profile
      await db.collection('users').doc(userId).update({
        profilePhotoUrl: result.url,
        updatedAt: new Date(),
      });

      return result.url;
    } catch (error) {
      logger.error('Upload profile photo error:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      pushNotifications?: boolean;
    }
  ): Promise<void> {
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
      }

      const currentPreferences = (userDoc.data() as User).preferences;

      await userRef.update({
        preferences: {
          ...currentPreferences,
          ...preferences,
        },
        updatedAt: new Date(),
      });

      logger.info(`Notification preferences updated for user ${userId}`);
    } catch (error) {
      logger.error('Update notification preferences error:', error);
      throw error;
    }
  }
}

export default new UserService();
