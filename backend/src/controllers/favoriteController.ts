import { Request, Response, NextFunction } from 'express';
import favoriteService from '../services/favoriteService';

export class FavoriteController {
  async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { propertyId } = req.body;

      const favorite = await favoriteService.addFavorite(userId, propertyId);

      res.status(201).json({
        success: true,
        data: favorite,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { propertyId } = req.params;

      await favoriteService.removeFavorite(userId, propertyId);

      res.json({
        success: true,
        data: {
          message: 'Favorite removed successfully',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;

      const favorites = await favoriteService.getUserFavorites(userId);

      res.json({
        success: true,
        data: favorites,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { propertyId } = req.params;

      const isFavorite = await favoriteService.isFavorite(userId, propertyId);

      res.json({
        success: true,
        data: {
          isFavorite,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FavoriteController();
