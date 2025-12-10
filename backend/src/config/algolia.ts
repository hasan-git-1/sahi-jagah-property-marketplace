import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';
import { logger } from './logger';

let client: SearchClient;
let propertiesIndex: SearchIndex;

// Initialize Algolia
const initializeAlgolia = () => {
  try {
    if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY) {
      throw new Error('Missing required Algolia configuration');
    }

    client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_ADMIN_KEY
    );

    propertiesIndex = client.initIndex(
      process.env.ALGOLIA_INDEX_NAME || 'properties'
    );

    // Configure index settings
    propertiesIndex.setSettings({
      searchableAttributes: [
        'title',
        'description',
        'address.city',
        'address.state',
        'amenities',
      ],
      attributesForFaceting: [
        'filterOnly(type)',
        'filterOnly(address.city)',
        'filterOnly(address.state)',
        'filterOnly(amenities)',
        'filterOnly(furnishingStatus)',
        'filterOnly(isVerified)',
        'filterOnly(status)',
      ],
      customRanking: ['desc(viewsCount)', 'desc(createdAt)'],
      ranking: [
        'typo',
        'geo',
        'words',
        'filters',
        'proximity',
        'attribute',
        'exact',
        'custom',
      ],
    });

    logger.info('Algolia configured successfully');
  } catch (error) {
    logger.error('Failed to configure Algolia:', error);
    throw error;
  }
};

// Initialize Algolia
initializeAlgolia();

export { client, propertiesIndex };

// Helper functions
export const indexProperty = async (property: any) => {
  try {
    await propertiesIndex.saveObject({
      objectID: property.id,
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      city: property.address.city,
      state: property.address.state,
      pincode: property.address.pincode,
      _geoloc: {
        lat: property.address.latitude,
        lng: property.address.longitude,
      },
      amenities: property.amenities,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      furnishingStatus: property.furnishingStatus,
      primaryPhotoUrl: property.photos[0]?.url || '',
      isVerified: property.isVerified,
      status: property.status,
      createdAt: property.createdAt,
      viewsCount: property.viewsCount,
      ownerId: property.ownerId,
    });
    logger.info(`Property ${property.id} indexed successfully`);
  } catch (error) {
    logger.error(`Failed to index property ${property.id}:`, error);
    throw error;
  }
};

export const updatePropertyIndex = async (propertyId: string, updates: any) => {
  try {
    await propertiesIndex.partialUpdateObject({
      objectID: propertyId,
      ...updates,
    });
    logger.info(`Property ${propertyId} index updated successfully`);
  } catch (error) {
    logger.error(`Failed to update property ${propertyId} index:`, error);
    throw error;
  }
};

export const deletePropertyFromIndex = async (propertyId: string) => {
  try {
    await propertiesIndex.deleteObject(propertyId);
    logger.info(`Property ${propertyId} removed from index`);
  } catch (error) {
    logger.error(`Failed to delete property ${propertyId} from index:`, error);
    throw error;
  }
};

export const searchProperties = async (query: string, filters?: any) => {
  try {
    const searchParams: any = {
      query,
      hitsPerPage: 20,
    };

    if (filters) {
      const filterStrings: string[] = [];

      if (filters.type) {
        filterStrings.push(`type:${filters.type}`);
      }
      if (filters.city) {
        filterStrings.push(`city:${filters.city}`);
      }
      if (filters.minPrice && filters.maxPrice) {
        filterStrings.push(`price:${filters.minPrice} TO ${filters.maxPrice}`);
      }
      if (filters.amenities && filters.amenities.length > 0) {
        filters.amenities.forEach((amenity: string) => {
          filterStrings.push(`amenities:${amenity}`);
        });
      }

      // Always filter for verified and active properties
      filterStrings.push('isVerified:true');
      filterStrings.push('status:active');

      if (filterStrings.length > 0) {
        searchParams.filters = filterStrings.join(' AND ');
      }
    }

    const result = await propertiesIndex.search(query, searchParams);
    return result;
  } catch (error) {
    logger.error('Failed to search properties:', error);
    throw error;
  }
};
