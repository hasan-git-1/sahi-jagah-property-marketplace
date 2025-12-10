import { v2 as cloudinary } from 'cloudinary';
import { logger } from './logger';

// Configure Cloudinary
const initializeCloudinary = () => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Missing required Cloudinary configuration');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    logger.info('Cloudinary configured successfully');
  } catch (error) {
    logger.error('Failed to configure Cloudinary:', error);
    throw error;
  }
};

// Initialize Cloudinary
initializeCloudinary();

export default cloudinary;

// Helper functions for common operations
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        }
      )
      .end(file.buffer);
  });
};

export const uploadVideo = async (
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; publicId: string; thumbnailUrl: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'video',
          eager: [
            { width: 1280, height: 720, crop: 'limit', format: 'mp4' },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            // Generate thumbnail URL
            const thumbnailUrl = cloudinary.url(result.public_id, {
              resource_type: 'video',
              format: 'jpg',
              transformation: [
                { width: 640, height: 360, crop: 'fill' },
              ],
            });

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              thumbnailUrl,
            });
          }
        }
      )
      .end(file.buffer);
  });
};

export const deleteAsset = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    logger.error('Failed to delete asset from Cloudinary:', error);
    throw error;
  }
};

export const generateSignedUploadUrl = (folder: string, resourceType: 'image' | 'video' = 'image') => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params = {
    timestamp,
    folder,
    resource_type: resourceType,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  };
};
