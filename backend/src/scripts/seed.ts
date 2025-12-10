import { db } from '../config/firebase';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

/**
 * Seed script to populate test data
 * Run with: npm run seed
 */

const SEED_PASSWORD = 'Test@1234';

// Sample users
const users = [
  {
    id: 'admin-001',
    email: 'admin@sahijagah.com',
    phone: '+919876543210',
    role: 'admin',
    name: 'Admin User',
    isActive: true,
    isVerified: true,
  },
  {
    id: 'owner-001',
    email: 'owner@example.com',
    phone: '+919876543211',
    role: 'owner',
    name: 'Rajesh Kumar',
    isActive: true,
    isVerified: true,
  },
  {
    id: 'agent-001',
    email: 'agent@example.com',
    phone: '+919876543212',
    role: 'agent',
    name: 'Priya Sharma',
    isActive: true,
    isVerified: true,
  },
  {
    id: 'client-001',
    email: 'client@example.com',
    phone: '+919876543213',
    role: 'client',
    name: 'Amit Patel',
    isActive: true,
    isVerified: true,
  },
];

// Sample properties
const properties = [
  {
    id: 'prop-001',
    title: '3BHK Luxury Apartment in Banjara Hills',
    description: 'Spacious 3BHK apartment with modern amenities in prime location of Hyderabad',
    price: 45000,
    propertyType: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    city: 'Hyderabad',
    address: 'Road No 12, Banjara Hills',
    location: { lat: 17.4239, lng: 78.4738 },
    amenities: ['parking', 'gym', 'security', 'power_backup', 'elevator'],
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    ownerId: 'owner-001',
    status: 'active',
    isVerified: true,
    viewCount: 45,
    favoritesCount: 8,
    inquiriesCount: 12,
  },
  {
    id: 'prop-002',
    title: '2BHK Independent House in Warangal',
    description: 'Beautiful independent house with garden in peaceful neighborhood',
    price: 8500000,
    propertyType: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    city: 'Warangal',
    address: 'Kazipet, Warangal',
    location: { lat: 17.9784, lng: 79.5941 },
    amenities: ['parking', 'garden', 'security'],
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    ownerId: 'owner-001',
    status: 'active',
    isVerified: true,
    viewCount: 23,
    favoritesCount: 5,
    inquiriesCount: 7,
  },
  {
    id: 'prop-003',
    title: '4BHK Villa with Sea View in Vizag',
    description: 'Luxurious villa with stunning sea view and private pool',
    price: 25000000,
    propertyType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area: 3000,
    city: 'Vishakhapatnam',
    address: 'Beach Road, Rushikonda',
    location: { lat: 17.7833, lng: 83.3833 },
    amenities: ['parking', 'pool', 'gym', 'security', 'garden', 'power_backup'],
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    ownerId: 'agent-001',
    status: 'active',
    isVerified: true,
    viewCount: 67,
    favoritesCount: 15,
    inquiriesCount: 20,
  },
  {
    id: 'prop-004',
    title: '1BHK Affordable Flat in Hyderabad',
    description: 'Compact 1BHK flat perfect for bachelors or small families',
    price: 12000,
    propertyType: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    city: 'Hyderabad',
    address: 'Kukatpally, Hyderabad',
    location: { lat: 17.4849, lng: 78.3915 },
    amenities: ['parking', 'security', 'power_backup'],
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    ownerId: 'owner-001',
    status: 'active',
    isVerified: true,
    viewCount: 89,
    favoritesCount: 12,
    inquiriesCount: 25,
  },
  {
    id: 'prop-005',
    title: '2BHK Apartment Near IT Hub',
    description: 'Modern apartment close to HITEC City and major IT companies',
    price: 28000,
    propertyType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    city: 'Hyderabad',
    address: 'Gachibowli, Hyderabad',
    location: { lat: 17.4399, lng: 78.3489 },
    amenities: ['parking', 'gym', 'security', 'power_backup', 'elevator', 'clubhouse'],
    images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
    ownerId: 'agent-001',
    status: 'active',
    isVerified: true,
    viewCount: 134,
    favoritesCount: 22,
    inquiriesCount: 35,
  },
];

async function seedUsers() {
  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash(SEED_PASSWORD, 12);

  for (const user of users) {
    const userDoc = await db.collection('users').doc(user.id).get();
    if (!userDoc.exists) {
      await db.collection('users').doc(user.id).set({
        ...user,
        password: hashedPassword,
        preferences: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✓ Created user: ${user.email}`);
    } else {
      console.log(`- User already exists: ${user.email}`);
    }
  }
}

async function seedProperties() {
  console.log('\nSeeding properties...');

  for (const property of properties) {
    const propDoc = await db.collection('properties').doc(property.id).get();
    if (!propDoc.exists) {
      await db.collection('properties').doc(property.id).set({
        ...property,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✓ Created property: ${property.title}`);
    } else {
      console.log(`- Property already exists: ${property.title}`);
    }
  }
}

async function seedBookings() {
  console.log('\nSeeding bookings...');

  const bookings = [
    {
      id: 'booking-001',
      propertyId: 'prop-001',
      clientId: 'client-001',
      ownerId: 'owner-001',
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      status: 'requested',
      notes: 'Interested in viewing the property this weekend',
    },
    {
      id: 'booking-002',
      propertyId: 'prop-003',
      clientId: 'client-001',
      ownerId: 'agent-001',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      status: 'confirmed',
      notes: 'Looking for a sea-facing property',
    },
    {
      id: 'booking-003',
      propertyId: 'prop-005',
      clientId: 'client-001',
      ownerId: 'agent-001',
      scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: 'completed',
      notes: 'Need property close to office',
    },
  ];

  for (const booking of bookings) {
    const bookingDoc = await db.collection('bookings').doc(booking.id).get();
    if (!bookingDoc.exists) {
      await db.collection('bookings').doc(booking.id).set({
        ...booking,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`✓ Created booking: ${booking.id}`);
    } else {
      console.log(`- Booking already exists: ${booking.id}`);
    }
  }
}

async function seedFavorites() {
  console.log('\nSeeding favorites...');

  const favorites = [
    { userId: 'client-001', propertyId: 'prop-001' },
    { userId: 'client-001', propertyId: 'prop-003' },
    { userId: 'client-001', propertyId: 'prop-005' },
  ];

  for (const favorite of favorites) {
    const favoriteId = `${favorite.userId}_${favorite.propertyId}`;
    const favoriteDoc = await db.collection('favorites').doc(favoriteId).get();
    if (!favoriteDoc.exists) {
      await db.collection('favorites').doc(favoriteId).set({
        ...favorite,
        createdAt: new Date().toISOString(),
      });
      console.log(`✓ Created favorite: ${favoriteId}`);
    } else {
      console.log(`- Favorite already exists: ${favoriteId}`);
    }
  }
}

async function seedNotifications() {
  console.log('\nSeeding notifications...');

  const notifications = [
    {
      id: 'notif-001',
      userId: 'owner-001',
      type: 'booking',
      title: 'New Booking Request',
      message: 'Amit Patel requested to visit your property in Banjara Hills',
      isRead: false,
      metadata: { bookingId: 'booking-001', propertyId: 'prop-001' },
    },
    {
      id: 'notif-002',
      userId: 'client-001',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your visit to Villa in Vizag has been confirmed',
      isRead: false,
      metadata: { bookingId: 'booking-002', propertyId: 'prop-003' },
    },
  ];

  for (const notification of notifications) {
    const notifDoc = await db.collection('notifications').doc(notification.id).get();
    if (!notifDoc.exists) {
      await db.collection('notifications').doc(notification.id).set({
        ...notification,
        createdAt: new Date().toISOString(),
      });
      console.log(`✓ Created notification: ${notification.id}`);
    } else {
      console.log(`- Notification already exists: ${notification.id}`);
    }
  }
}

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');
    console.log('Test credentials:');
    console.log('  Email: admin@sahijagah.com / owner@example.com / agent@example.com / client@example.com');
    console.log('  Password: Test@1234\n');

    await seedUsers();
    await seedProperties();
    await seedBookings();
    await seedFavorites();
    await seedNotifications();

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nYou can now login with any of the test accounts.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
