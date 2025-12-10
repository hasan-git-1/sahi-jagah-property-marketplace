import { db } from '../config/firebase';
import { Property, CreatePropertyDto, UpdatePropertyDto } from '../models/property';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';
import { indexProperty, updatePropertyIndex, deletePropertyFromIndex } from '../config/algolia';

export class PropertyService {
  async createProperty(ownerId: string, data: CreatePropertyDto): Promise<Property> {
    try {
      const propertyData: Omit<Property, 'id'> = {
        ownerId,
        ...data,
        currency: 'INR',
        photos: [],
        videos: [],
        isVerified: false,
        verificationStatus: 'pending',
        verificationDocs: [],
        viewsCount: 0,
        inquiriesCount: 0,
        favoritesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
      };

      const docRef = await db.collection('properties').add(propertyData);
      const property: Property = { id: docRef.id, ...propertyData };

      logger.info(`Property created: ${docRef.id}`);
      return property;
    } catch (error) {
      logger.error('Create property error:', error);
      throw error;
    }
  }

  async getPropertyById(propertyId: string): Promise<Property> {
    try {
      const doc = await db.collection('properties').doc(propertyId).get();

      if (!doc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      return { id: doc.id, ...doc.data() } as Property;
    } catch (error) {
      logger.error('Get property error:', error);
      throw error;
    }
  }

  async listProperties(filters?: {
    ownerId?: string;
    city?: string;
    type?: string;
    status?: string;
    limit?: number;
  }): Promise<Property[]> {
    try {
      let query: any = db.collection('properties');

      if (filters?.ownerId) {
        query = query.where('ownerId', '==', filters.ownerId);
      }
      if (filters?.city) {
        query = query.where('address.city', '==', filters.city);
      }
      if (filters?.type) {
        query = query.where('type', '==', filters.type);
      }
      if (filters?.status) {
        query = query.where('status', '==', filters.status);
      }

      query = query.orderBy('createdAt', 'desc');

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Property));
    } catch (error) {
      logger.error('List properties error:', error);
      throw error;
    }
  }

  async updateProperty(
    propertyId: string,
    ownerId: string,
    updates: UpdatePropertyDto
  ): Promise<Property> {
    try {
      const propertyRef = db.collection('properties').doc(propertyId);
      const doc = await propertyRef.get();

      if (!doc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      const property = doc.data() as Property;

      // Check ownership
      if (property.ownerId !== ownerId) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'You do not own this property');
      }

      await propertyRef.update({
        ...updates,
        updatedAt: new Date(),
      });

      const updatedDoc = await propertyRef.get();
      const updatedProperty = { id: updatedDoc.id, ...updatedDoc.data() } as Property;

      // Update search index if property is verified and active
      if (updatedProperty.isVerified && updatedProperty.status === 'active') {
        await updatePropertyIndex(propertyId, updates);
      }

      logger.info(`Property updated: ${propertyId}`);
      return updatedProperty;
    } catch (error) {
      logger.error('Update property error:', error);
      throw error;
    }
  }

  async deleteProperty(propertyId: string, ownerId: string): Promise<void> {
    try {
      const propertyRef = db.collection('properties').doc(propertyId);
      const doc = await propertyRef.get();

      if (!doc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      const property = doc.data() as Property;

      // Check ownership
      if (property.ownerId !== ownerId) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'You do not own this property');
      }

      // Soft delete
      await propertyRef.update({
        status: 'inactive',
        updatedAt: new Date(),
      });

      // Remove from search index
      await deletePropertyFromIndex(propertyId);

      logger.info(`Property deleted: ${propertyId}`);
    } catch (error) {
      logger.error('Delete property error:', error);
      throw error;
    }
  }

  async incrementViewCount(propertyId: string): Promise<void> {
    try {
      const propertyRef = db.collection('properties').doc(propertyId);
      await propertyRef.update({
        viewsCount: (await propertyRef.get()).data()?.viewsCount + 1 || 1,
      });
    } catch (error) {
      logger.error('Increment view count error:', error);
    }
  }

  async addMedia(
    propertyId: string,
    ownerId: string,
    media: { url: string; publicId: string; type: 'photo' | 'video'; thumbnailUrl?: string }
  ): Promise<void> {
    try {
      const propertyRef = db.collection('properties').doc(propertyId);
      const doc = await propertyRef.get();

      if (!doc.exists) {
        throw new AppError(404, 'PROPERTY_NOT_FOUND', 'Property not found');
      }

      const property = doc.data() as Property;

      if (property.ownerId !== ownerId) {
        throw new AppError(403, 'FORBIDDEN_RESOURCE', 'You do not own this property');
      }

      if (media.type === 'photo') {
        const photos = property.photos || [];
        photos.push({
          url: media.url,
          publicId: media.publicId,
          order: photos.length,
        });
        await propertyRef.update({ photos, updatedAt: new Date() });
      } else {
        const videos = property.videos || [];
        videos.push({
          url: media.url,
          publicId: media.publicId,
          thumbnailUrl: media.thumbnailUrl || '',
        });
        await propertyRef.update({ videos, updatedAt: new Date() });
      }

      logger.info(`Media added to property: ${propertyId}`);
    } catch (error) {
      logger.error('Add media error:', error);
      throw error;
    }
  }
}

export default new PropertyService();
