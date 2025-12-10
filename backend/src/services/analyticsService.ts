import { firestore } from '../config/firebase';

export interface DashboardMetrics {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalConversations: number;
  activeUsers: number;
  activeProperties: number;
  pendingVerifications: number;
  revenueThisMonth: number;
}

export interface AnalyticsData {
  byCity: { [city: string]: number };
  byPropertyType: { rent: number; sale: number };
  usersByRole: { client: number; owner: number; agent: number; admin: number };
  bookingsByStatus: { requested: number; confirmed: number; cancelled: number; completed: number };
}

export interface TrendData {
  registrations: { date: string; count: number }[];
  listings: { date: string; count: number }[];
  bookings: { date: string; count: number }[];
}

export class AnalyticsService {
  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get counts
    const [usersSnapshot, propertiesSnapshot, bookingsSnapshot, conversationsSnapshot] =
      await Promise.all([
        firestore.collection('users').get(),
        firestore.collection('properties').get(),
        firestore.collection('bookings').get(),
        firestore.collection('conversations').get(),
      ]);

    // Calculate active users (logged in within 30 days)
    const activeUsers = usersSnapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.lastLoginAt && data.lastLoginAt > thirtyDaysAgo;
    }).length;

    // Calculate active properties
    const activeProperties = propertiesSnapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.status === 'active';
    }).length;

    // Calculate pending verifications
    const pendingVerifications = propertiesSnapshot.docs.filter((doc) => {
      const data = doc.data();
      return data.verificationStatus === 'pending';
    }).length;

    return {
      totalUsers: usersSnapshot.size,
      totalProperties: propertiesSnapshot.size,
      totalBookings: bookingsSnapshot.size,
      totalConversations: conversationsSnapshot.size,
      activeUsers,
      activeProperties,
      pendingVerifications,
      revenueThisMonth: 0, // Placeholder for future revenue tracking
    };
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<AnalyticsData> {
    const [usersSnapshot, propertiesSnapshot, bookingsSnapshot] = await Promise.all([
      firestore.collection('users').get(),
      firestore.collection('properties').get(),
      firestore.collection('bookings').get(),
    ]);

    // Aggregate by city
    const byCity: { [city: string]: number } = {};
    propertiesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const city = data.address?.city || 'Unknown';
      byCity[city] = (byCity[city] || 0) + 1;
    });

    // Aggregate by property type
    const byPropertyType = { rent: 0, sale: 0 };
    propertiesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.type === 'rent') byPropertyType.rent++;
      else if (data.type === 'sale') byPropertyType.sale++;
    });

    // Aggregate users by role
    const usersByRole = { client: 0, owner: 0, agent: 0, admin: 0 };
    usersSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const role = data.role || 'client';
      if (role in usersByRole) {
        usersByRole[role as keyof typeof usersByRole]++;
      }
    });

    // Aggregate bookings by status
    const bookingsByStatus = { requested: 0, confirmed: 0, cancelled: 0, completed: 0 };
    bookingsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const status = data.status || 'requested';
      if (status in bookingsByStatus) {
        bookingsByStatus[status as keyof typeof bookingsByStatus]++;
      }
    });

    return {
      byCity,
      byPropertyType,
      usersByRole,
      bookingsByStatus,
    };
  }

  /**
   * Get trend data for date range
   */
  async getTrends(startDate: Date, endDate: Date): Promise<TrendData> {
    const start = startDate.getTime();
    const end = endDate.getTime();

    const [usersSnapshot, propertiesSnapshot, bookingsSnapshot] = await Promise.all([
      firestore
        .collection('users')
        .where('createdAt', '>=', start)
        .where('createdAt', '<=', end)
        .get(),
      firestore
        .collection('properties')
        .where('createdAt', '>=', start)
        .where('createdAt', '<=', end)
        .get(),
      firestore
        .collection('bookings')
        .where('createdAt', '>=', start)
        .where('createdAt', '<=', end)
        .get(),
    ]);

    // Group by date
    const registrations = this.groupByDate(usersSnapshot.docs, start, end);
    const listings = this.groupByDate(propertiesSnapshot.docs, start, end);
    const bookings = this.groupByDate(bookingsSnapshot.docs, start, end);

    return {
      registrations,
      listings,
      bookings,
    };
  }

  /**
   * Helper: Group documents by date
   */
  private groupByDate(
    docs: FirebaseFirestore.QueryDocumentSnapshot[],
    start: number,
    end: number
  ): { date: string; count: number }[] {
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.ceil((end - start) / dayMs);
    const result: { date: string; count: number }[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(start + i * dayMs);
      const dateStr = date.toISOString().split('T')[0];
      const count = docs.filter((doc) => {
        const data = doc.data();
        const docDate = new Date(data.createdAt);
        return docDate.toISOString().split('T')[0] === dateStr;
      }).length;

      result.push({ date: dateStr, count });
    }

    return result;
  }

  /**
   * Get user list with filters
   */
  async getUsers(filters?: {
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
  }): Promise<any[]> {
    let query: FirebaseFirestore.Query = firestore.collection('users');

    if (filters?.role) {
      query = query.where('role', '==', filters.role);
    }

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    let users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      users = users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.includes(searchLower)
      );
    }

    return users;
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: 'active' | 'suspended'): Promise<void> {
    await firestore.collection('users').doc(userId).update({
      status,
      updatedAt: Date.now(),
    });
  }

  /**
   * Get properties for admin
   */
  async getProperties(filters?: {
    status?: string;
    verificationStatus?: string;
    city?: string;
    limit?: number;
  }): Promise<any[]> {
    let query: FirebaseFirestore.Query = firestore.collection('properties');

    if (filters?.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters?.verificationStatus) {
      query = query.where('verificationStatus', '==', filters.verificationStatus);
    }

    if (filters?.city) {
      query = query.where('address.city', '==', filters.city);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * Verify property
   */
  async verifyProperty(propertyId: string, approved: boolean, reason?: string): Promise<void> {
    await firestore
      .collection('properties')
      .doc(propertyId)
      .update({
        verificationStatus: approved ? 'verified' : 'rejected',
        verificationReason: reason || null,
        verifiedAt: approved ? Date.now() : null,
        updatedAt: Date.now(),
      });

    // TODO: Send notification to property owner
  }
}

export const analyticsService = new AnalyticsService();
