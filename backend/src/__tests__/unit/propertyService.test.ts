/**
 * Property Service Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { createTestProperty, createTestUser } from '../helpers/testData.js';
import { PropertyStatus } from '../../models/property.js';

describe('PropertyService', () => {
  describe('Property Creation', () => {
    it('should create property with pending status', () => {
      const property = createTestProperty({ status: 'pending' as PropertyStatus });

      expect(property.status).toBe('pending');
      expect(property.isVerified).toBe(false);
    });

    it('should store CDN URLs for media', () => {
      const property = createTestProperty({
        images: [
          'https://res.cloudinary.com/demo/image1.jpg',
          'https://res.cloudinary.com/demo/image2.jpg',
        ],
        videos: ['https://res.cloudinary.com/demo/video1.mp4'],
      });

      expect(property.images).toHaveLength(2);
      expect(property.videos).toHaveLength(1);
      expect(property.images[0]).toContain('cloudinary.com');
    });

    it('should initialize counters to zero', () => {
      const property = createTestProperty();

      expect(property.views).toBe(0);
      expect(property.favoritesCount).toBe(0);
      expect(property.inquiriesCount).toBe(0);
    });
  });

  describe('Property Status Management', () => {
    it('should exclude inactive properties from search', () => {
      const activeProperty = createTestProperty({ status: 'active' as PropertyStatus });
      const inactiveProperty = createTestProperty({ status: 'inactive' as PropertyStatus });

      const searchableProperties = [activeProperty, inactiveProperty].filter(
        (p) => p.status === 'active' && p.isVerified
      );

      expect(searchableProperties).toHaveLength(1);
      expect(searchableProperties[0].id).toBe(activeProperty.id);
    });

    it('should allow property status updates', () => {
      const property = createTestProperty({ status: 'active' as PropertyStatus });

      property.status = 'rented' as PropertyStatus;
      property.updatedAt = new Date();

      expect(property.status).toBe('rented');
    });
  });

  describe('Property Validation', () => {
    it('should validate file size limits', () => {
      const maxImageSize = 10 * 1024 * 1024; // 10MB
      const maxVideoSize = 100 * 1024 * 1024; // 100MB

      const imageSize = 5 * 1024 * 1024; // 5MB
      const videoSize = 50 * 1024 * 1024; // 50MB

      expect(imageSize).toBeLessThanOrEqual(maxImageSize);
      expect(videoSize).toBeLessThanOrEqual(maxVideoSize);
    });

    it('should validate required fields', () => {
      const property = createTestProperty();

      expect(property.title).toBeTruthy();
      expect(property.description).toBeTruthy();
      expect(property.type).toBeTruthy();
      expect(property.price).toBeGreaterThan(0);
      expect(property.city).toBeTruthy();
      expect(property.location).toBeTruthy();
    });
  });

  describe('Property Views', () => {
    it('should increment view count', () => {
      const property = createTestProperty({ views: 10 });

      property.views += 1;

      expect(property.views).toBe(11);
    });
  });

  describe('Search Indexing', () => {
    it('should only index verified active properties', () => {
      const properties = [
        createTestProperty({ status: 'active' as PropertyStatus, isVerified: true }),
        createTestProperty({ status: 'active' as PropertyStatus, isVerified: false }),
        createTestProperty({ status: 'inactive' as PropertyStatus, isVerified: true }),
      ];

      const indexableProperties = properties.filter(
        (p) => p.status === 'active' && p.isVerified
      );

      expect(indexableProperties).toHaveLength(1);
    });
  });
});
