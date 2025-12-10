/**
 * Document Controller
 * 
 * Handles document upload and verification endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { documentService } from '../services/documentService.js';
import { logger } from '../config/logger.js';

export class DocumentController {
  /**
   * Upload document
   * POST /api/v1/properties/:propertyId/documents
   */
  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const { type } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!type) {
        return res.status(400).json({ error: 'Document type is required' });
      }

      const userId = req.user!.userId;

      const document = await documentService.uploadDocument(
        propertyId,
        userId,
        type,
        file
      );

      res.status(201).json({
        message: 'Document uploaded successfully',
        document,
      });
    } catch (error) {
      logger.error('Error in uploadDocument:', error);
      next(error);
    }
  }

  /**
   * Get document by ID
   * GET /api/v1/documents/:id
   */
  async getDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const document = await documentService.getDocument(id);

      res.json({ document });
    } catch (error) {
      logger.error('Error in getDocument:', error);
      next(error);
    }
  }

  /**
   * Get property documents
   * GET /api/v1/properties/:propertyId/documents
   */
  async getPropertyDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;

      const documents = await documentService.getPropertyDocuments(propertyId);

      res.json({ documents });
    } catch (error) {
      logger.error('Error in getPropertyDocuments:', error);
      next(error);
    }
  }

  /**
   * Delete document
   * DELETE /api/v1/documents/:id
   */
  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      await documentService.deleteDocument(id, userId);

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteDocument:', error);
      next(error);
    }
  }

  /**
   * Get pending documents (admin only)
   * GET /api/v1/admin/verification/pending
   */
  async getPendingDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await documentService.getPendingDocuments();

      res.json({ documents });
    } catch (error) {
      logger.error('Error in getPendingDocuments:', error);
      next(error);
    }
  }

  /**
   * Approve document (admin only)
   * PUT /api/v1/admin/verification/:id/approve
   */
  async approveDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const adminId = req.user!.userId;

      const document = await documentService.verifyDocument(
        id,
        adminId,
        'approved'
      );

      res.json({
        message: 'Document approved successfully',
        document,
      });
    } catch (error) {
      logger.error('Error in approveDocument:', error);
      next(error);
    }
  }

  /**
   * Reject document (admin only)
   * PUT /api/v1/admin/verification/:id/reject
   */
  async rejectDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user!.userId;

      if (!reason) {
        return res.status(400).json({ error: 'Rejection reason is required' });
      }

      const document = await documentService.verifyDocument(
        id,
        adminId,
        'rejected',
        reason
      );

      res.json({
        message: 'Document rejected successfully',
        document,
      });
    } catch (error) {
      logger.error('Error in rejectDocument:', error);
      next(error);
    }
  }
}

export const documentController = new DocumentController();
