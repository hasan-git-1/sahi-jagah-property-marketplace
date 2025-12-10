import { db } from '../config/firebase';

/**
 * Service for exporting user data (GDPR compliance)
 */

export class DataExportService {
  /**
   * Export all user data in JSON format
   */
  static async exportUserData(userId: string): Promise<any> {
    const userData: any = {
      exportDate: new Date().toISOString(),
      userId,
    };

    // Get user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      userData.profile = userDoc.data();
    }

    // Get user's properties
    const propertiesSnapshot = await db
      .collection('properties')
      .where('ownerId', '==', userId)
      .get();
    userData.properties = propertiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's bookings
    const bookingsSnapshot = await db
      .collection('bookings')
      .where('clientId', '==', userId)
      .get();
    userData.bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's favorites
    const favoritesSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .get();
    userData.favorites = favoritesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's notifications
    const notificationsSnapshot = await db
      .collection('notifications')
      .where('userId', '==', userId)
      .get();
    userData.notifications = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get user's conversations
    const conversationsSnapshot = await db
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();
    userData.conversations = conversationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return userData;
  }

  /**
   * Delete user account and anonymize data
   */
  static async deleteUserAccount(userId: string): Promise<void> {
    const batch = db.batch();

    // Anonymize user profile
    const userRef = db.collection('users').doc(userId);
    batch.update(userRef, {
      email: `deleted_${userId}@deleted.com`,
      phone: null,
      name: 'Deleted User',
      profilePhoto: null,
      isActive: false,
      deletedAt: new Date().toISOString(),
    });

    // Delete favorites
    const favoritesSnapshot = await db
      .collection('favorites')
      .where('userId', '==', userId)
      .get();
    favoritesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete notifications
    const notificationsSnapshot = await db
      .collection('notifications')
      .where('userId', '==', userId)
      .get();
    notificationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Anonymize bookings (keep for records)
    const bookingsSnapshot = await db
      .collection('bookings')
      .where('clientId', '==', userId)
      .get();
    bookingsSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        clientId: 'deleted_user',
        notes: '[User deleted]',
      });
    });

    // Deactivate properties
    const propertiesSnapshot = await db
      .collection('properties')
      .where('ownerId', '==', userId)
      .get();
    propertiesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'inactive',
        ownerId: 'deleted_user',
      });
    });

    await batch.commit();
  }
}
