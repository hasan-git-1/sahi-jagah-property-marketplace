import { Request, Response, NextFunction } from 'express';
import propertyService from '../services/propertyService';
import { AppError } from '../middlewares/errorHandler';
import { uploadImage, uploadVideo } from '../config/cloudinary';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

export class PropertyController {
  async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerId = req.user!.userId;
      const property = await propertyService.createProperty(ownerId, req.body);

      res.status(201).json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyById(id);

      // Increment view count (async, don't wait)
      propertyService.incrementViewCount(id);

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async listProperties(req: Request, res: Response, next: NextFunction) {
    try {
      const { ownerId, city, type, status, limit } = req.query;

      const properties = await propertyService.listProperties({
        ownerId: ownerId as string,
        city: city as string,
        type: type as string,
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        success: true,
        data: properties,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ownerId = req.user!.userId;

      const property = await propertyService.updateProperty(id, ownerId, req.body);

      res.json({
        success: true,
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ownerId = req.user!.userId;

      await propertyService.deleteProperty(id, ownerId);

      res.json({
        success: true,
        data: {
          message: 'Property deleted successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadMedia(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ownerId = req.user!.userId;
      const { type } = req.body; // 'photo' or 'video'

      if (!req.file) {
        throw new AppError(400, 'VALIDATION_FAILED', 'No file uploaded');
      }

      // Validate file size
      const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (req.file.size > maxSize) {
        throw new AppError(400, 'FILE_TOO_LARGE', `File size exceeds ${maxSize / 1024 / 1024}MB`);
      }

      let result;
      if (type === 'video') {
        result = await uploadVideo(req.file, `properties/${id}`);
        await propertyService.addMedia(id, ownerId, {
          url: result.url,
          publicId: result.publicId,
          type: 'video',
          thumbnailUrl: result.thumbnailUrl,
        });
      } else {
        result = await uploadImage(req.file, `properties/${id}`);
        await propertyService.addMedia(id, ownerId, {
          url: result.url,
          publicId: result.publicId,
          type: 'photo',
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const propertyController = new PropertyController();
export const uploadMiddleware = upload.single('file');
