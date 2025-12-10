import { Request, Response, NextFunction } from 'express';
import { searchProperties } from '../config/algolia';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, city, type, minPrice, maxPrice, amenities } = req.query;

      const filters: any = {};

      if (city) filters.city = city;
      if (type) filters.type = type;
      if (minPrice && maxPrice) {
        filters.minPrice = parseFloat(minPrice as string);
        filters.maxPrice = parseFloat(maxPrice as string);
      }
      if (amenities) {
        filters.amenities = Array.isArray(amenities) ? amenities : [amenities];
      }

      const results = await searchProperties(query as string || '', filters);

      res.json({
        success: true,
        data: {
          hits: results.hits,
          nbHits: results.nbHits,
          page: results.page,
          nbPages: results.nbPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SearchController();
