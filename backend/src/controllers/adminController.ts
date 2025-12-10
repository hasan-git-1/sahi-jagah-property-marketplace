import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';
import { z } from 'zod';

// Validation schemas
const dateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

const userStatusSchema = z.object({
  status: z.enum(['active', 'suspended']),
});

const verifyPropertySchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional(),
});

export class AdminController {
  /**
   * Get dashboard metrics
   * GET /api/v1/admin/dashboard
   */
  async getDashboard(req: Request, res: Response) {
    try {
      const metrics = await analyticsService.getDashboardMetrics();

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error: any) {
      console.error('Get dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard metrics',
        error: error.message,
      });
    }
  }

  /**
   * Get analytics data
   * GET /api/v1/admin/analytics
   */
  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getAnalytics();

      // Get trends if date range provided
      let trends = null;
      if (req.query.startDate && req.query.endDate) {
        const validation = dateRangeSchema.safeParse(req.query);
        if (validation.success) {
          const { startDate, endDate } = validation.data;
          trends = await analyticsService.getTrends(new Date(startDate), new Date(endDate));
        }
      }

      res.json({
        success: true,
        data: {
          ...analytics,
          trends,
        },
      });
    } catch (error: any) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics',
        error: error.message,
      });
    }
  }

  /**
   * Get users list
   * GET /api/v1/admin/users
   */
  async getUsers(req: Request, res: Response) {
    try {
      const filters = {
        role: req.query.role as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      };

      const users = await analyticsService.getUsers(filters);

      res.json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users',
        error: error.message,
      });
    }
  }

  /**
   * Update user status
   * PUT /api/v1/admin/users/:id/status
   */
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = userStatusSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { status } = validation.data;
      await analyticsService.updateUserStatus(id, status);

      res.json({
        success: true,
        message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      });
    } catch (error: any) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: error.message,
      });
    }
  }

  /**
   * Get properties list
   * GET /api/v1/admin/properties
   */
  async getProperties(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        verificationStatus: req.query.verificationStatus as string | undefined,
        city: req.query.city as string | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      };

      const properties = await analyticsService.getProperties(filters);

      res.json({
        success: true,
        data: properties,
      });
    } catch (error: any) {
      console.error('Get properties error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch properties',
        error: error.message,
      });
    }
  }

  /**
   * Verify property
   * PUT /api/v1/admin/properties/:id/verify
   */
  async verifyProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validation = verifyPropertySchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.error.errors,
        });
      }

      const { approved, reason } = validation.data;
      await analyticsService.verifyProperty(id, approved, reason);

      res.json({
        success: true,
        message: `Property ${approved ? 'verified' : 'rejected'} successfully`,
      });
    } catch (error: any) {
      console.error('Verify property error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify property',
        error: error.message,
      });
    }
  }
}

export const adminController = new AdminController();
