import { db } from '../config/firebase';
import { Favorite } from '../models/favorite';
import { Property } from '../models/property';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';

export class FavoriteService {
  async addFavorite(userId: string, propertyId: string): Promise<Favorite> {
    try {
      // Check if property exists
      const propertyDoc = await db.collection('properties').doc(propertyId).get();
      if (!propertyDoc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      // Check if already favorited
      const existingFavorite = await db
        .collection('favorites')
        .where('userId', '==', userId)
        .where('propertyId', '==', propertyId)
        .limit(1)
        .get();

      if (!existingFavorite.empty) {
        throw new AppError(409, 'RESOURCE_ALREADY_EXISTS', 'Property already in favorites');
      }

      // Create favorite
      const favoriteData: Omit<Favorite, 'id'> = {
        userId,
        propertyId,
        createdAt: new Date(),
      };

      const docRef = await db.collection('favorites').add(favoriteData);

      // Increment favorites count on property
      await db
        .collection('properties')
        .doc(propertyId)
        .update({
          favoritesCount: (propertyDoc.data() as Property).favoritesCount + 1 || 1,
        });

      logger.info(`Favorite added: ${docRef.id}`);
      return { id: docRef.id, ...favoriteData };
    } catch (error) {
      logger.error('Add favorite error:', error);
      throw error;
    }
  }

  async removeFavorite(userId: string, propertyId: string): Promise<void> {
    try {
      const favoriteSnapshot = await db
        .collection('favorites')
        .where('userId', '==', userId)
        .where('propertyId', '==', propertyId)
        .limit(1)
        .get();

      if (favoriteSnapshot.empty) {
        throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Favorite not found');
      }

      const favoriteDoc = favoriteSnapshot.docs[0];
      await favoriteDoc.ref.delete();

      // Decrement favorites count on property
      const propertyDoc = await db.collection('properties').doc(propertyId).get();
      if (propertyDoc.exists) {
        const currentCount = (propertyDoc.data() as Property).favoritesCount || 0;
        await propertyDoc.ref.update({
          favoritesCount: Math.max(0, currentCount - 1),
        });
      }

      logger.info(`Favorite removed: ${favoriteDoc.id}`);
    } catch (error) {
      logger.error('Remove favorite error:', error);
      throw error;
    }
  }

  async getUserFavorites(userId: string): Promise<Property[]> {
    try {
      // Get user's favorite property IDs
      const favoritesSnapshot = await db
        .collection('favorites')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      if (favoritesSnapshot.empty) {
        return [];
      }

      const propertyIds = favoritesSnapshot.docs.map((doc) => doc.data().propertyId);

      // Get property details
      const properties: Property[] = [];
      for (const propertyId of propertyIds) {
        const propertyDoc = await db.collection('properties').doc(propertyId).get();
        if (propertyDoc.exists) {
          const property = propertyDoc.data() as Property;
          // Only include active properties
          if (property.status === 'active') {
            properties.push({ id: propertyDoc.id, ...property });
          }
        }
      }

      return properties;
    } catch (error) {
      logger.error('Get user favorites error:', error);
      throw error;
    }
  }

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    try {
      const favoriteSnapshot = await db
        .collection('favorites')
        .where('userId', '==', userId)
        .where('propertyId', '==', propertyId)
        .limit(1)
        .get();

      return !favoriteSnapshot.empty;
    } catch (error) {
      logger.error('Check favorite error:', error);
      return false;
    }
  }

  // Remove favorites when property becomes inactive
  async removeFavoritesForProperty(propertyId: string): Promise<void> {
    try {
      const favoritesSnapshot = await db
        .collection('favorites')
        .where('propertyId', '==', propertyId)
        .get();

      const batch = db.batch();
      favoritesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      logger.info(`Removed ${favoritesSnapshot.size} favorites for property ${propertyId}`);
    } catch (error) {
      logger.error('Remove favorites for property error:', error);
    }
  }
}

export default new FavoriteService();
