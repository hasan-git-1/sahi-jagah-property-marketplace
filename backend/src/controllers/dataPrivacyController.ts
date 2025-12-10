import { Request, Response } from 'express';
import { DataExportService } from '../services/dataExportService';
import { logger } from '../config/logger';

/**
 * Controller for data privacy operations (GDPR compliance)
 */

export class DataPrivacyController {
  /**
   * Export user data
   */
  static async exportData(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user.id;

      logger.info(`Data export requested by user: ${userId}`);

      const data = await DataExportService.exportUserData(userId);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="user-data-${userId}.json"`);
      res.json(data);
    } catch (error) {
      logger.error('Error exporting user data:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'EXPORT_FAILED',
          message: 'Failed to export user data',
        },
      });
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user.id;

      logger.info(`Account deletion requested by user: ${userId}`);

      await DataExportService.deleteUserAccount(userId);

      res.json({
        success: true,
        message: 'Account deleted successfully. Your data has been anonymized.',
      });
    } catch (error) {
      logger.error('Error deleting user account:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'Failed to delete account',
        },
      });
    }
  }
}
