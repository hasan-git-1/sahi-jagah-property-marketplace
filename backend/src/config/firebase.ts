import admin from 'firebase-admin';
import { logger } from './logger';

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('Missing required Firebase configuration');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });

    logger.info('Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
};

// Initialize Firebase
initializeFirebase();

// Export Firebase services
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
export const realtimeDb = admin.database();
export const messaging = admin.messaging();

// Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
