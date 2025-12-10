# Sahi Jagah - Architecture Documentation

## Overview

Sahi Jagah is a full-stack property marketplace platform built with a modern, scalable architecture designed for Indian tier-2 and tier-3 cities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  React SPA (Vite)                                               │
│  ├── Pages (Auth, Properties, Search, Bookings, Messages)      │
│  ├── Components (Header, Footer, Cards, Forms, Modals)         │
│  ├── State Management (Zustand)                                │
│  ├── Server State (React Query)                                │
│  └── Real-time (Firebase Realtime DB)                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                              │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                              │
│  ├── Security (Helmet, CORS, Rate Limiting)                    │
│  ├── Authentication (JWT)                                       │
│  ├── Input Sanitization                                         │
│  └── Audit Logging                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  Controllers → Services → Models                                │
│  ├── Auth Service                                               │
│  ├── User Service                                               │
│  ├── Property Service                                           │
│  ├── Booking Service                                            │
│  ├── Messaging Service                                          │
│  ├── Notification Service                                       │
│  └── Analytics Service                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  Firebase Firestore (Primary Database)                         │
│  Firebase Realtime DB (Real-time Messaging)                    │
│  Firebase Storage (Media Files)                                │
│  Firebase Auth (User Authentication)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
├─────────────────────────────────────────────────────────────────┤
│  Cloudinary (Media Storage & Optimization)                      │
│  Algolia (Search Engine)                                        │
│  SendGrid (Email Notifications)                                 │
│  Twilio (SMS/OTP)                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite (fast HMR, optimized builds)
- **UI Library:** Material-UI (MUI) for consistent design
- **State Management:** Zustand (lightweight, simple)
- **Server State:** React Query (caching, refetching)
- **HTTP Client:** Axios with interceptors
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts for analytics
- **Real-time:** Firebase Realtime Database

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** Firebase Firestore (NoSQL)
- **Real-time DB:** Firebase Realtime Database
- **Storage:** Firebase Storage + Cloudinary
- **Search:** Algolia
- **Authentication:** Firebase Auth + JWT
- **Email:** SendGrid
- **SMS:** Twilio
- **Validation:** Zod
- **Logging:** Winston
- **Security:** Helmet, bcrypt, rate-limiting

### Infrastructure
- **Hosting:** Netlify (frontend), Vercel/Firebase Functions (backend)
- **Database:** Firebase Firestore
- **Storage:** Firebase Storage + Cloudinary CDN
- **Search:** Algolia
- **CI/CD:** GitHub Actions (planned)
- **Monitoring:** Sentry (planned)

## Design Patterns

### Backend Patterns

#### 1. Layered Architecture
```
Controllers (HTTP) → Services (Business Logic) → Models (Data)
```

**Benefits:**
- Separation of concerns
- Testability
- Maintainability
- Reusability

#### 2. Service Pattern
Each domain has a dedicated service:
- `AuthService` - Authentication and authorization
- `UserService` - User management
- `PropertyService` - Property CRUD operations
- `BookingService` - Booking management
- `MessagingService` - Real-time messaging
- `NotificationService` - Multi-channel notifications

#### 3. Middleware Pattern
Request processing pipeline:
```
Request → Security → Auth → RBAC → Sanitization → Controller → Response
```

#### 4. Repository Pattern (Implicit)
Services abstract database operations, making it easy to switch databases if needed.

### Frontend Patterns

#### 1. Component-Based Architecture
```
Pages → Components → UI Elements
```

#### 2. Container/Presentational Pattern
- **Container Components:** Handle logic and state
- **Presentational Components:** Pure UI rendering

#### 3. Custom Hooks Pattern
Reusable logic extracted into custom hooks:
- `useAuth()` - Authentication state
- `useNotifications()` - Notification management
- `useMessaging()` - Real-time messaging

#### 4. State Management Strategy
- **Local State:** useState for component-specific state
- **Global State:** Zustand for auth, messaging, notifications
- **Server State:** React Query for API data with caching

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  phone: string;
  role: 'client' | 'owner' | 'agent' | 'admin';
  name: string;
  profilePhoto?: string;
  isActive: boolean;
  isVerified: boolean;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Property
```typescript
{
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  address: string;
  location: { lat: number; lng: number };
  amenities: string[];
  images: string[];
  videos?: string[];
  ownerId: string;
  status: 'active' | 'inactive' | 'rented' | 'sold';
  isVerified: boolean;
  viewCount: number;
  favoritesCount: number;
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Booking
```typescript
{
  id: string;
  propertyId: string;
  clientId: string;
  ownerId: string;
  scheduledDate: string;
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Security Architecture

### Authentication Flow
```
1. User submits credentials
2. Backend validates credentials
3. Generate JWT access token (24h) + refresh token (30d)
4. Store refresh token in httpOnly cookie
5. Client stores access token in memory
6. Include access token in Authorization header
7. Backend validates token on each request
8. Refresh token when access token expires
```

### Authorization (RBAC)
```
Request → authMiddleware → rbacMiddleware → Controller
```

**Role Hierarchy:**
- **Admin:** Full access to all resources
- **Owner/Agent:** Manage own properties, respond to bookings
- **Client:** Search properties, book visits, message owners

### Security Layers
1. **Network:** HTTPS only, CORS configured
2. **Headers:** HSTS, CSP, X-Frame-Options, XSS protection
3. **Input:** Sanitization middleware, Zod validation
4. **Authentication:** JWT with refresh tokens
5. **Authorization:** RBAC middleware
6. **Rate Limiting:** 5 auth/min, 3 OTP/hour
7. **Audit:** Logging sensitive operations

## Database Design

### Firestore Collections

#### users
```
users/{userId}
  - email, phone, role, name, profilePhoto
  - preferences, isActive, isVerified
  - createdAt, updatedAt
```

#### properties
```
properties/{propertyId}
  - title, description, price, propertyType
  - bedrooms, bathrooms, area, city, address
  - location, amenities, images, videos
  - ownerId, status, isVerified
  - viewCount, favoritesCount, inquiriesCount
  - createdAt, updatedAt
```

#### bookings
```
bookings/{bookingId}
  - propertyId, clientId, ownerId
  - scheduledDate, status, notes
  - cancellationReason
  - createdAt, updatedAt
```

#### favorites
```
favorites/{favoriteId}
  - userId, propertyId
  - createdAt
```

#### notifications
```
notifications/{notificationId}
  - userId, type, title, message
  - isRead, metadata
  - createdAt
```

#### auditLogs
```
auditLogs/{logId}
  - userId, action, resource, resourceId
  - ipAddress, userAgent, timestamp
  - success, details
```

### Firebase Realtime Database

#### conversations
```
conversations/{conversationId}
  - participants: [userId1, userId2]
  - propertyId
  - lastMessage, lastMessageTime
  - unreadCount: { userId1: 0, userId2: 3 }
  - createdAt, updatedAt
```

#### messages
```
conversations/{conversationId}/messages/{messageId}
  - senderId, text, attachments
  - isRead, readAt
  - createdAt
```

### Indexes

**Composite Indexes:**
- `properties`: (city, propertyType, status, isVerified)
- `bookings`: (clientId, status), (ownerId, status)
- `favorites`: (userId, propertyId)
- `notifications`: (userId, isRead, createdAt)

## API Design

### RESTful Principles
- **Resources:** Nouns (users, properties, bookings)
- **HTTP Methods:** GET, POST, PUT, DELETE
- **Status Codes:** 200, 201, 400, 401, 403, 404, 500
- **Versioning:** /api/v1/...

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": { ... }
  }
}
```

### Rate Limiting
- Authentication: 5 requests/minute
- OTP: 3 requests/hour
- General API: 100 requests/minute

## Real-time Architecture

### Messaging System
```
Client A → Firebase Realtime DB ← Client B
```

**Flow:**
1. Client A sends message via REST API
2. Backend writes to Realtime DB
3. Client B receives via real-time listener
4. Update unread counts
5. Send push notification if offline

**Benefits:**
- True real-time updates
- Offline support
- Automatic synchronization
- Scalable

## Scalability Considerations

### Current Architecture
- **Frontend:** Static files on CDN (Netlify)
- **Backend:** Serverless functions (Vercel/Firebase)
- **Database:** Firestore (auto-scaling)
- **Storage:** Cloudinary CDN (global)
- **Search:** Algolia (managed service)

### Scaling Strategy
1. **Horizontal Scaling:** Add more serverless instances
2. **Caching:** React Query on frontend, Redis on backend
3. **CDN:** Static assets and media on CDN
4. **Database:** Firestore sharding (automatic)
5. **Search:** Algolia handles scaling

### Performance Optimizations
- **Frontend:**
  - Code splitting by route
  - Lazy loading components
  - Image optimization (Cloudinary)
  - React Query caching
  
- **Backend:**
  - Database query optimization
  - Composite indexes
  - Connection pooling
  - Response compression

## Deployment Architecture

### Development
```
Local → Git Push → GitHub
```

### Staging (Planned)
```
GitHub → GitHub Actions → Run Tests → Deploy to Staging
```

### Production (Planned)
```
GitHub (main) → GitHub Actions → Run Tests → Deploy to Production
```

### Environments
- **Development:** Local with Firebase emulators
- **Staging:** Netlify preview + Vercel preview
- **Production:** Netlify + Vercel with custom domains

## Monitoring & Observability (Planned)

### Logging
- **Backend:** Winston → Cloud Logging
- **Frontend:** Console errors → Sentry

### Metrics
- **Performance:** Lighthouse scores
- **Uptime:** Status page
- **Analytics:** Google Analytics, Mixpanel

### Alerting
- **Errors:** Sentry alerts
- **Downtime:** Uptime monitoring
- **Performance:** Slow query alerts

## Disaster Recovery

### Backup Strategy
- **Database:** Daily Firestore backups
- **Storage:** Cloudinary automatic backups
- **Code:** Git version control

### Recovery Plan
1. Restore database from backup
2. Redeploy from Git
3. Verify data integrity
4. Notify users if needed

## Future Enhancements

### Phase 2
- Document verification system
- Digital lease generation
- WebRTC video calls
- Payment integration (Razorpay)

### Phase 3
- Mobile apps (React Native)
- ML-based recommendations
- Virtual tours (360° images)
- Multi-language support

### Phase 4
- Advanced analytics
- Property valuation AI
- Tenant screening
- Maintenance tracking

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0
