# Design Document

## Overview

Sahi Jagah is a full-stack property marketplace application built with a modern, scalable architecture. The system uses React for the frontend, Node.js/Express for the backend API, Firebase for authentication and real-time features, Cloudinary for media management, and Algolia for search functionality. The architecture follows a three-tier pattern with clear separation between presentation (React SPA), business logic (Node.js API), and data persistence (Firebase Firestore + Cloud Storage).

The application supports four user roles (Owner, Client, Agent, Admin) with role-based access control enforced at both the API and UI layers. The system is designed for deployment on Netlify (frontend) and Vercel/Firebase Functions (backend), with horizontal scalability through serverless functions and managed services.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   React SPA (Netlify)                                 │  │
│  │   - Redux/Zustand State Management                    │  │
│  │   - React Query for Server State                      │  │
│  │   - React Router for Navigation                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ WebSocket (Messaging)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   Node.js/Express API (Vercel/Firebase Functions)    │  │
│  │   - Authentication Middleware (JWT)                   │  │
│  │   - RBAC Authorization                                │  │
│  │   - Input Validation & Sanitization                   │  │
│  │   - Rate Limiting                                     │  │
│  │   - Business Logic Services                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data & Services Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Firebase    │  │  Cloudinary  │  │    Algolia      │  │
│  │  Firestore   │  │  (Media CDN) │  │  (Search Index) │  │
│  │  (Database)  │  └──────────────┘  └─────────────────┘  │
│  │              │                                           │
│  │  Firebase    │  ┌──────────────┐  ┌─────────────────┐  │
│  │  Auth        │  │  Firebase    │  │   Firebase      │  │
│  │              │  │  Storage     │  │   Cloud         │  │
│  │  Firebase    │  │  (Documents) │  │   Messaging     │  │
│  │  Realtime DB │  └──────────────┘  │   (Push)        │  │
│  │  (Chat)      │                     └─────────────────┘  │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- State Management: Zustand (lightweight) or Redux Toolkit
- Server State: React Query (TanStack Query)
- Routing: React Router v6
- UI Framework: Material-UI or Tailwind CSS + Headless UI
- Form Handling: React Hook Form + Zod validation
- Real-time: Firebase Realtime Database SDK
- WebRTC: Simple-peer library
- Build Tool: Vite
- Testing: Vitest + React Testing Library

**Backend:**
- Node.js 18+ with TypeScript
- Framework: Express.js
- Authentication: Firebase Admin SDK + JWT
- Validation: Zod
- ORM/Database Client: Firebase Admin SDK for Firestore
- File Upload: Multer + Cloudinary SDK
- Search: Algolia JavaScript client
- PDF Generation: PDFKit or Puppeteer
- WebSocket: Socket.io (optional, if not using Firebase Realtime DB)
- Testing: Jest + Supertest
- API Documentation: Swagger/OpenAPI

**Infrastructure & Services:**
- Database: Firebase Firestore (NoSQL document store)
- Authentication: Firebase Authentication
- Real-time Messaging: Firebase Realtime Database
- File Storage: Firebase Cloud Storage + Cloudinary
- Search: Algolia
- Push Notifications: Firebase Cloud Messaging
- SMS: Twilio (optional, for OTP)
- Email: SendGrid or Firebase Extensions
- Hosting: Netlify (frontend), Vercel or Firebase Functions (backend)
- CI/CD: GitHub Actions
- Monitoring: Sentry (errors), Google Analytics (usage)

## Components and Interfaces

### Frontend Components

#### Authentication Module
- `LoginPage`: Email/phone + password/OTP login
- `SignupPage`: Registration with role selection
- `OTPVerification`: OTP input and verification
- `ProfilePage`: User profile management
- `ProtectedRoute`: HOC for route protection

#### Property Module
- `PropertySearchPage`: Search bar, filters, map/list toggle
- `PropertyCard`: Compact property display for lists
- `PropertyDetailPage`: Full property information with gallery
- `PropertyForm`: Create/edit property listing
- `ImageUploader`: Multi-image upload with preview
- `VideoUploader`: Video upload component
- `PropertyGallery`: Image carousel with lightbox
- `VirtualTourViewer`: 360° tour placeholder

#### Booking Module
- `BookingCalendar`: Date/time picker for visit scheduling
- `BookingModal`: Booking request form
- `BookingCard`: Display booking information
- `BookingList`: List of bookings with filters

#### Messaging Module
- `ConversationList`: List of user conversations
- `ChatWindow`: Message thread display
- `MessageInput`: Text input with attachment support
- `MessageBubble`: Individual message display
- `AttachmentPreview`: Image/file preview in messages

#### Dashboard Module
- `OwnerDashboard`: Property management, analytics, bookings
- `ClientDashboard`: Saved properties, bookings, messages
- `AgentDashboard`: Assigned properties, client interactions
- `AdminDashboard`: Moderation queue, analytics, user management

#### Verification Module
- `DocumentUploader`: Secure document upload
- `VerificationQueue`: Admin view of pending verifications
- `VerificationCard`: Document review interface

#### Lease Module
- `LeaseGenerator`: Form to create lease terms
- `LeasePreview`: PDF preview before signing
- `SignatureCapture`: E-signature interface
- `LeaseList`: List of user leases

#### Common Components
- `Header`: Navigation with role-based menu
- `Footer`: Links and company information
- `NotificationBell`: Notification dropdown
- `HelpdeskWidget`: Contact support (phone + chat)
- `SearchBar`: Global property search
- `FilterPanel`: Advanced search filters
- `MapView`: Property location map (Google Maps)
- `LoadingSpinner`: Loading states
- `ErrorBoundary`: Error handling

### Backend API Structure

#### Controllers
- `AuthController`: Signup, login, OTP, token refresh
- `UserController`: Profile CRUD, preferences
- `PropertyController`: Property CRUD, search, media upload
- `BookingController`: Booking CRUD, status updates
- `MessageController`: Conversation and message management
- `DocumentController`: Document upload, retrieval
- `VerificationController`: Admin verification actions
- `LeaseController`: Lease generation, signing
- `AdminController`: Dashboard metrics, moderation
- `NotificationController`: Send notifications

#### Services
- `AuthService`: Authentication logic, token generation
- `UserService`: User business logic
- `PropertyService`: Property operations, search indexing
- `BookingService`: Booking logic, notifications
- `MessageService`: Real-time message handling
- `StorageService`: File upload to Cloudinary/Firebase Storage
- `SearchService`: Algolia index management
- `VerificationService`: Document verification workflow
- `LeaseService`: PDF generation, signature tracking
- `NotificationService`: Multi-channel notifications (push, email, SMS)
- `AnalyticsService`: Metrics aggregation

#### Middleware
- `authMiddleware`: JWT validation
- `rbacMiddleware`: Role-based access control
- `validationMiddleware`: Request validation with Zod
- `rateLimitMiddleware`: Rate limiting
- `errorHandler`: Global error handling
- `requestLogger`: Request/response logging

#### Routes
```
/api/v1
  /auth
    POST /signup
    POST /login
    POST /otp/send
    POST /otp/verify
    POST /refresh
    POST /logout
  /users
    GET /:id
    PUT /:id
    DELETE /:id
    GET /:id/favorites
    POST /:id/favorites
    DELETE /:id/favorites/:propertyId
  /properties
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
    POST /:id/media
    DELETE /:id/media/:mediaId
    POST /:id/documents
    GET /:id/analytics
  /bookings
    GET /
    POST /
    GET /:id
    PUT /:id
    DELETE /:id
  /conversations
    GET /
    POST /
    GET /:id
    POST /:id/messages
    GET /:id/messages
  /documents
    POST /
    GET /:id
    DELETE /:id
  /leases
    POST /generate
    GET /:id
    POST /:id/sign
    GET /:id/download
  /admin
    GET /dashboard
    GET /verification/pending
    PUT /verification/:id/approve
    PUT /verification/:id/reject
    GET /users
    PUT /users/:id/status
    GET /properties
    PUT /properties/:id/verify
    GET /analytics
  /notifications
    GET /
    PUT /:id/read
    PUT /read-all
```

## Data Models

### Firestore Collections

#### users
```typescript
{
  id: string;                    // Auto-generated UID
  role: 'owner' | 'client' | 'agent' | 'admin';
  name: string;
  email?: string;
  phone?: string;
  hashedPassword?: string;       // Null for phone-only auth
  profilePhotoUrl?: string;
  isVerified: boolean;
  verificationDocs: string[];    // Document IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
  };
  status: 'active' | 'suspended' | 'deleted';
}
```

#### properties
```typescript
{
  id: string;
  ownerId: string;               // Reference to users
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  currency: 'INR';
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  amenities: string[];           // ['parking', 'gym', 'pool', etc.]
  bedrooms?: number;
  bathrooms?: number;
  area?: number;                 // Square feet
  furnishingStatus?: 'furnished' | 'semi-furnished' | 'unfurnished';
  photos: Array<{
    url: string;
    publicId: string;            // Cloudinary ID
    order: number;
  }>;
  videos: Array<{
    url: string;
    publicId: string;
    thumbnailUrl: string;
  }>;
  virtualTourUrl?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDocs: string[];    // Document IDs
  rejectionReason?: string;
  viewsCount: number;
  inquiriesCount: number;
  favoritesCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'inactive' | 'rented' | 'sold';
  availableFrom?: Timestamp;
}
```

#### bookings
```typescript
{
  id: string;
  propertyId: string;
  clientId: string;
  ownerId: string;
  scheduledAt: Timestamp;
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;          // User ID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

#### conversations
```typescript
{
  id: string;
  participants: string[];        // Array of user IDs (always 2)
  participantDetails: Array<{    // Denormalized for quick access
    userId: string;
    name: string;
    photoUrl?: string;
    role: string;
  }>;
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastMessageSenderId: string;
  createdAt: Timestamp;
  propertyId?: string;           // Context property if applicable
}
```

#### messages (subcollection under conversations)
```typescript
{
  id: string;
  conversationId: string;        // Parent conversation
  senderId: string;
  receiverId: string;
  content: string;
  attachments: Array<{
    type: 'image' | 'document';
    url: string;
    filename: string;
    size: number;
  }>;
  readAt?: Timestamp;
  createdAt: Timestamp;
  status: 'sent' | 'delivered' | 'read';
}
```

#### documents
```typescript
{
  id: string;
  userId?: string;               // User document
  propertyId?: string;           // Property document
  docType: 'identity' | 'ownership' | 'tax' | 'noc' | 'other';
  filename: string;
  fileUrl: string;               // Firebase Storage path
  mimeType: string;
  size: number;
  uploadedAt: Timestamp;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;           // Admin user ID
  verifiedAt?: Timestamp;
  rejectionReason?: string;
}
```

#### leases
```typescript
{
  id: string;
  propertyId: string;
  ownerId: string;
  clientId: string;
  terms: {
    startDate: Timestamp;
    endDate: Timestamp;
    monthlyRent: number;
    securityDeposit: number;
    maintenanceCharges?: number;
    additionalTerms?: string;
  };
  leasePdfUrl: string;
  signedByOwner: boolean;
  signedByClient: boolean;
  ownerSignedAt?: Timestamp;
  clientSignedAt?: Timestamp;
  ownerSignature?: string;       // Base64 or URL
  clientSignature?: string;
  status: 'draft' | 'pending_signatures' | 'active' | 'expired' | 'terminated';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### notifications
```typescript
{
  id: string;
  userId: string;
  type: 'booking' | 'message' | 'verification' | 'lease' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;    // Additional context
  read: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
  actionUrl?: string;            // Deep link
}
```

#### auditLogs
```typescript
{
  id: string;
  userId: string;
  action: string;                // 'property_verified', 'user_suspended', etc.
  entityType: 'user' | 'property' | 'booking' | 'document';
  entityId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
}
```

#### analytics (aggregated data)
```typescript
{
  id: string;                    // Format: 'daily_2024-01-15' or 'monthly_2024-01'
  period: 'daily' | 'weekly' | 'monthly';
  date: Timestamp;
  metrics: {
    newUsers: number;
    newProperties: number;
    totalBookings: number;
    completedBookings: number;
    totalMessages: number;
    propertyViews: number;
    searchQueries: number;
  };
  byCity: Record<string, {       // City-wise breakdown
    properties: number;
    bookings: number;
    views: number;
  }>;
  byPropertyType: Record<string, {
    count: number;
    avgPrice: number;
  }>;
}
```

### Algolia Search Index Schema

```typescript
{
  objectID: string;              // Property ID
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  city: string;
  state: string;
  pincode: string;
  _geoloc: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnishingStatus: string;
  primaryPhotoUrl: string;
  isVerified: boolean;
  status: string;
  createdAt: number;             // Unix timestamp
  viewsCount: number;
  ownerId: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After reviewing all testable properties from the prework analysis, I've identified opportunities to consolidate and eliminate redundancy:

**Consolidations:**
- Properties 2.1, 2.2, 2.3 (property CRUD operations) can be combined into comprehensive property lifecycle properties
- Properties 4.1, 4.3, 4.4 (booking state transitions) can be consolidated into booking state machine properties
- Properties 7.2, 7.3 (verification approval/rejection) can be combined into a single verification workflow property
- Properties 10.1, 10.2, 10.3, 10.4 (various notifications) can be consolidated into notification delivery properties
- Properties 11.1, 11.3 (favorites add/remove) can be combined into favorites management property

**Eliminations:**
- Timing constraints (within X seconds/minutes) are performance requirements better tested separately
- Infrastructure requirements (HTTPS, encryption at rest) are deployment concerns
- Documentation and tooling requirements are not runtime behaviors
- UI rendering and accessibility are better tested with E2E/accessibility tools

The consolidated properties below provide comprehensive coverage while avoiding redundant validation.

### Correctness Properties

Property 1: User registration creates account with correct role
*For any* valid registration data containing name, email or phone, role, and optional password, submitting the registration should create a user account with the specified role and appropriate authentication method
**Validates: Requirements 1.1**

Property 2: JWT tokens are issued with correct expiration
*For any* valid login credentials (email/phone and password/OTP), successful authentication should issue a JWT token that expires exactly 24 hours from issuance
**Validates: Requirements 1.3**

Property 3: Protected resources enforce RBAC
*For any* protected API endpoint and any user role, accessing the endpoint should succeed only if the user's role has permission for that endpoint
**Validates: Requirements 1.4**

Property 4: OTP expiration is enforced
*For any* generated OTP, verification should succeed within 10 minutes of generation and fail after 10 minutes
**Validates: Requirements 1.5**

Property 5: Property creation sets pending status
*For any* valid property listing data submitted by an owner, creating the property should result in a record with verification status set to pending
**Validates: Requirements 2.1**

Property 6: Media upload stores CDN URLs
*For any* valid image or video file uploaded for a property, the upload should store the file in Cloudinary and save the CDN URL in the property record
**Validates: Requirements 2.2**

Property 7: Property updates persist changes
*For any* property and any valid update to its fields, updating the property should persist all changes to the database
**Validates: Requirements 2.3**

Property 8: Inactive properties excluded from search
*For any* property marked as inactive, searching with any query should not return that property in results
**Validates: Requirements 2.4**

Property 9: File size validation enforced
*For any* uploaded file, images exceeding 10MB or videos exceeding 100MB should be rejected with a validation error
**Validates: Requirements 2.5**

Property 10: Search returns matching properties
*For any* search query with filters (city, price range, type, amenities), all returned properties should satisfy all specified filter criteria
**Validates: Requirements 3.1, 3.3**

Property 11: Search results contain required fields
*For any* property in search results, the result should include title, price, location, primary image, and key amenities
**Validates: Requirements 3.2**

Property 12: Only verified active properties are indexed
*For any* property, it should appear in the search index if and only if it is both verified and active
**Validates: Requirements 3.4**

Property 13: Property views increment correctly
*For any* property, viewing it should increment the views counter by exactly one
**Validates: Requirements 3.5**

Property 14: Booking creation sets requested status
*For any* valid booking request with property, client, and scheduled time, creating the booking should result in a record with status set to requested
**Validates: Requirements 4.1**

Property 15: Booking notifications sent to correct users
*For any* booking event (created, confirmed, cancelled), notifications should be sent to both the property owner and the client
**Validates: Requirements 4.2**

Property 16: Booking state transitions are valid
*For any* booking, state transitions should follow the valid flow: requested → confirmed → completed, or requested/confirmed → cancelled
**Validates: Requirements 4.3, 4.4**

Property 17: Booking modifications allowed in requested state
*For any* booking in requested status, the owner should be able to modify the scheduled time, but modifications should fail for bookings in other states
**Validates: Requirements 4.5**

Property 18: Conversation creation includes both participants
*For any* two users, initiating a conversation should create a conversation record with both user IDs in the participants array
**Validates: Requirements 5.1**

Property 19: Messages are delivered to recipient
*For any* message sent in a conversation, the message should be persisted and accessible to the recipient
**Validates: Requirements 5.2, 5.5**

Property 20: Message attachments include CDN URLs
*For any* message with an image attachment, the message should contain the Cloudinary CDN URL for the image
**Validates: Requirements 5.3**

Property 21: Message read status tracked correctly
*For any* new message, it should be marked as unread initially and change to read when the recipient views the conversation
**Validates: Requirements 5.4**

Property 22: Document upload creates verification request
*For any* valid document uploaded for a property, the upload should store the document securely and set the property verification status to pending
**Validates: Requirements 6.1, 6.2**

Property 23: Document format and size validation
*For any* uploaded document, it should be accepted only if the format is PDF, JPG, or PNG and the size does not exceed 10MB
**Validates: Requirements 6.3**

Property 24: Document access generates signed URLs
*For any* stored document, accessing it should generate a signed URL with 1-hour expiration
**Validates: Requirements 6.4**


Property 25: Verification queue shows pending properties
*For any* set of properties with various verification statuses, the admin verification queue should display only properties with pending status, ordered by submission date
**Validates: Requirements 7.1**

Property 26: Verification approval updates status and notifies
*For any* property with pending verification, admin approval should update the status to approved, make the property searchable, and send a notification to the owner
**Validates: Requirements 7.2, 7.4**

Property 27: Verification rejection updates status with reason
*For any* property with pending verification, admin rejection with a reason should update the status to rejected and notify the owner with the rejection reason
**Validates: Requirements 7.3**

Property 28: Verification actions are logged
*For any* verification action (approve or reject), the system should create an audit log entry with admin ID, timestamp, and decision
**Validates: Requirements 7.5**

Property 29: Lease PDF contains all required information
*For any* lease generated from property and party details, the PDF should contain property details, owner information, client information, and all lease terms
**Validates: Requirements 8.1**

Property 30: New leases have unsigned flags
*For any* newly generated lease, both signed_by_owner and signed_by_client flags should be false
**Validates: Requirements 8.2**

Property 31: Signing updates flag and timestamp
*For any* lease, when a party signs it, the corresponding signed flag should become true and the signature timestamp should be recorded
**Validates: Requirements 8.3**

Property 32: Fully signed leases trigger email delivery
*For any* lease, when both parties have signed it, the system should send the final PDF to both parties via email
**Validates: Requirements 8.4**

Property 33: Lease documents have long-lived signed URLs
*For any* stored lease document, the signed URL should be valid for 5 years
**Validates: Requirements 8.5**

Property 34: Dashboard displays accurate counts
*For any* point in time, the admin dashboard should display counts of users, properties, bookings, and conversations that match the actual database counts
**Validates: Requirements 9.1**

Property 35: Analytics aggregations are correct
*For any* set of properties and bookings, analytics should correctly aggregate views, inquiries, and conversion rates by city and property type
**Validates: Requirements 9.2**

Property 36: Dashboard metrics update with new data
*For any* new entity created (user, property, booking), the dashboard metrics should reflect the change
**Validates: Requirements 9.3**

Property 37: Date range filtering works correctly
*For any* date range filter applied to analytics, only data within that range should be included in the metrics
**Validates: Requirements 9.4**

Property 38: Trend calculations are accurate
*For any* time series of user registrations, property listings, or bookings, the calculated trends should correctly represent the data
**Validates: Requirements 9.5**

Property 39: Notifications sent to affected users
*For any* booking or verification event, notifications should be sent to all users affected by that event
**Validates: Requirements 10.1, 10.3**

Property 40: Message notifications respect user state
*For any* new message, a push notification should be sent only if the recipient is not currently viewing the conversation
**Validates: Requirements 10.2**

Property 41: SMS notifications respect user preferences
*For any* critical event, SMS notifications should be sent only to users who have enabled SMS notifications in their preferences
**Validates: Requirements 10.4**

Property 42: Notification preferences are persisted
*For any* user preference update for notifications, the new preferences should be saved and applied to future notifications
**Validates: Requirements 10.5**

Property 43: Favorites creation associates user and property
*For any* client and property, marking the property as favorite should create a record linking the client ID and property ID
**Validates: Requirements 11.1**

Property 44: Favorites list shows current property data
*For any* client's favorites list, all properties should be displayed with their current status and pricing
**Validates: Requirements 11.2**

Property 45: Favorites removal deletes record
*For any* favorited property, removing it from favorites should delete the association record
**Validates: Requirements 11.3**

Property 46: Inactive properties removed from favorites
*For any* favorited property that becomes inactive or is deleted, it should be automatically removed from all users' favorites lists
**Validates: Requirements 11.4**

Property 47: No limit on favorites count
*For any* client, they should be able to add any number of properties to their favorites list without encountering a limit
**Validates: Requirements 11.5**

Property 48: Invalid requests return 400 with details
*For any* API request with invalid data, the response should have status 400 and include detailed error messages indicating which fields are invalid
**Validates: Requirements 12.3**

Property 49: Unauthenticated access returns 401
*For any* protected endpoint accessed without authentication, the response should have status 401
**Validates: Requirements 12.4**

Property 50: Unauthorized actions return 403
*For any* action attempted by a user without the required role, the response should have status 403 with an explanation
**Validates: Requirements 12.5**

Property 51: Passwords are hashed with bcrypt
*For any* user account created with a password, the stored password should be a bcrypt hash with cost factor of at least 10
**Validates: Requirements 13.1**

Property 52: Rate limiting enforced on auth endpoints
*For any* IP address, authentication endpoint requests should be limited to 5 per minute
**Validates: Requirements 13.3**

Property 53: Security headers present on all responses
*For any* API response, it should include HSTS, CSP, and X-Frame-Options headers
**Validates: Requirements 13.4**

Property 54: Malicious inputs are sanitized
*For any* user input containing potential XSS or injection payloads, the input should be sanitized before processing
**Validates: Requirements 13.5**

Property 55: WebRTC connections established for calls
*For any* call initiated between two users, a WebRTC connection should be established between them
**Validates: Requirements 17.1**

Property 56: Call failures show fallback number
*For any* failed WebRTC connection attempt, the UI should display the helpdesk phone number 7093187420
**Validates: Requirements 17.2**

Property 57: Call termination logs duration
*For any* call that is ended, the system should log the call duration
**Validates: Requirements 17.4**

Property 58: Both audio and video modes supported
*For any* call, users should be able to choose between audio-only and video modes
**Validates: Requirements 17.5**

Property 59: Account deletion removes personal data
*For any* user requesting account deletion, all personal data should be removed while retaining anonymized transaction records
**Validates: Requirements 18.3**

Property 60: Data export returns complete JSON
*For any* user requesting data export, the system should return a JSON file containing all their personal data
**Validates: Requirements 18.4**

Property 61: Sensitive data access is logged
*For any* access to sensitive user data, an audit log entry should be created
**Validates: Requirements 18.5**


## Error Handling

### Error Response Format

All API errors follow a consistent JSON structure:

```typescript
{
  success: false,
  error: {
    code: string,           // Machine-readable error code
    message: string,        // Human-readable error message
    details?: any,          // Additional context (validation errors, etc.)
    timestamp: string,      // ISO 8601 timestamp
    requestId: string       // Unique request identifier for tracking
  }
}
```

### Error Categories

**Authentication Errors (401)**
- `AUTH_TOKEN_MISSING`: No authentication token provided
- `AUTH_TOKEN_INVALID`: Token is malformed or invalid
- `AUTH_TOKEN_EXPIRED`: Token has expired
- `AUTH_CREDENTIALS_INVALID`: Invalid email/phone or password
- `AUTH_OTP_INVALID`: OTP is incorrect or expired

**Authorization Errors (403)**
- `FORBIDDEN_ROLE`: User role lacks permission for this action
- `FORBIDDEN_RESOURCE`: User cannot access this specific resource
- `FORBIDDEN_OPERATION`: Operation not allowed in current state

**Validation Errors (400)**
- `VALIDATION_FAILED`: Request data failed validation (includes field-level details)
- `INVALID_FORMAT`: Data format is incorrect (e.g., invalid email)
- `MISSING_REQUIRED_FIELD`: Required field is missing
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `UNSUPPORTED_FILE_TYPE`: File type not allowed

**Resource Errors (404)**
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `USER_NOT_FOUND`: User ID not found
- `PROPERTY_NOT_FOUND`: Property ID not found

**Conflict Errors (409)**
- `RESOURCE_ALREADY_EXISTS`: Resource with same identifier exists
- `EMAIL_ALREADY_REGISTERED`: Email is already in use
- `PHONE_ALREADY_REGISTERED`: Phone number is already in use
- `INVALID_STATE_TRANSITION`: Operation not valid for current resource state

**Rate Limit Errors (429)**
- `RATE_LIMIT_EXCEEDED`: Too many requests from this IP/user

**Server Errors (500)**
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `DATABASE_ERROR`: Database operation failed
- `EXTERNAL_SERVICE_ERROR`: Third-party service (Cloudinary, Algolia) failed

### Error Handling Strategy

**Frontend:**
- Display user-friendly error messages in UI
- Log detailed errors to Sentry for debugging
- Implement retry logic for transient failures
- Show fallback UI for critical failures
- Validate inputs before submission to reduce server errors

**Backend:**
- Catch all errors in global error handler middleware
- Log errors with context (user ID, request ID, stack trace)
- Never expose sensitive information in error messages
- Return appropriate HTTP status codes
- Implement circuit breakers for external services

### Logging Strategy

**Log Levels:**
- `ERROR`: Application errors, exceptions, failed operations
- `WARN`: Deprecated API usage, rate limit warnings, validation failures
- `INFO`: Successful operations, state changes, user actions
- `DEBUG`: Detailed execution flow (development only)

**Structured Logging:**
```typescript
{
  level: 'error' | 'warn' | 'info' | 'debug',
  timestamp: string,
  requestId: string,
  userId?: string,
  action: string,
  message: string,
  metadata: Record<string, any>,
  error?: {
    name: string,
    message: string,
    stack: string
  }
}
```

**Log Retention:**
- Production logs: 90 days
- Error logs: 1 year
- Audit logs: 7 years (compliance requirement)


## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and property-based tests for universal correctness properties. This comprehensive approach ensures both concrete bug detection and general correctness verification.

### Property-Based Testing

**Library:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing cases

**Property Test Organization:**
Each property-based test must:
1. Be tagged with a comment referencing the design document property
2. Use the format: `// Feature: sahi-jagah-property-marketplace, Property {number}: {property_text}`
3. Implement exactly one correctness property from the design document
4. Generate random valid inputs using custom generators
5. Assert the universal property holds for all generated inputs

**Example Property Test Structure:**
```typescript
// Feature: sahi-jagah-property-marketplace, Property 1: User registration creates account with correct role
test('user registration creates account with correct role', () => {
  fc.assert(
    fc.asyncProperty(
      registrationDataGenerator(),
      async (registrationData) => {
        const user = await authService.signup(registrationData);
        expect(user.role).toBe(registrationData.role);
        expect(user.email || user.phone).toBeDefined();
      }
    ),
    { numRuns: 100 }
  );
});
```

**Custom Generators:**
Implement generators for domain objects:
- `userGenerator()`: Random users with various roles
- `propertyGenerator()`: Random properties with valid data
- `bookingGenerator()`: Random bookings with valid dates
- `messageGenerator()`: Random messages with/without attachments
- `documentGenerator()`: Random documents with valid formats

### Unit Testing

**Library:** Jest (backend) + Vitest (frontend)

**Coverage Requirements:**
- Minimum 70% code coverage for backend services
- Focus on business logic, not boilerplate
- Test edge cases and error conditions
- Test integration points between components

**Unit Test Categories:**

**1. Service Layer Tests:**
- Test individual service methods with specific inputs
- Mock external dependencies (database, APIs)
- Verify correct error handling
- Test state transitions

**2. Controller Tests:**
- Test request validation
- Test response formatting
- Test error responses
- Mock service layer

**3. Middleware Tests:**
- Test authentication middleware with valid/invalid tokens
- Test RBAC middleware with different roles
- Test rate limiting behavior
- Test input validation

**4. Component Tests (Frontend):**
- Test component rendering with various props
- Test user interactions (clicks, form submissions)
- Test conditional rendering
- Mock API calls with React Query

**5. Integration Tests:**
- Test complete API endpoints with real database (test instance)
- Test authentication flow end-to-end
- Test file upload workflows
- Test real-time messaging

### End-to-End Testing

**Library:** Playwright

**Critical User Flows:**
1. **Signup and Login Flow:**
   - Email signup → email verification → login
   - Phone signup → OTP verification → login
   - Role selection and profile setup

2. **Property Listing Flow:**
   - Owner creates property → uploads images → submits for verification
   - Admin reviews → approves property
   - Property appears in search results

3. **Booking Flow:**
   - Client searches properties → views details → requests visit
   - Owner receives notification → confirms booking
   - Both parties receive confirmation

4. **Messaging Flow:**
   - Client initiates conversation → sends message
   - Owner receives notification → replies
   - Messages appear in real-time

5. **Lease Flow:**
   - Generate lease → owner signs → client signs
   - Both parties receive signed PDF

**E2E Test Configuration:**
- Run against staging environment
- Use test accounts with known credentials
- Clean up test data after each run
- Take screenshots on failure
- Record videos for debugging

### Test Data Management

**Fixtures:**
- Predefined test users for each role
- Sample properties across different cities
- Mock images and documents
- Predefined booking scenarios

**Factories:**
- User factory with customizable attributes
- Property factory with random but valid data
- Booking factory with valid date ranges
- Message factory with various content types

**Database Seeding:**
- Seed script creates consistent test data
- Includes 10 properties across 3 cities
- Includes users for each role
- Includes sample bookings and messages
- Idempotent (can run multiple times safely)

### Continuous Integration

**GitHub Actions Workflow:**

```yaml
name: CI/CD Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies
      - Run linters (ESLint, Prettier)
      - Run unit tests with coverage
      - Run property-based tests
      - Run integration tests
      - Upload coverage to Codecov
      
  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies
      - Start test database
      - Run E2E tests with Playwright
      - Upload test artifacts
      
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy frontend to Netlify staging
      - Deploy backend to Vercel staging
      - Run smoke tests
      
  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - Deploy frontend to Netlify production
      - Deploy backend to Vercel production
      - Run smoke tests
      - Notify team
```

### Test Execution Strategy

**Development:**
- Run unit tests on file save (watch mode)
- Run property tests before commit
- Run integration tests before push

**CI Pipeline:**
- Run all tests on every push
- Fail build if coverage drops below threshold
- Fail build if any property test fails
- Run E2E tests only on main branch

**Pre-Release:**
- Run full test suite including E2E
- Run performance tests
- Run security scans
- Manual QA for critical flows

### Monitoring and Observability

**Error Tracking:**
- Sentry for frontend and backend errors
- Automatic error grouping and alerting
- Source map support for stack traces
- User context attached to errors

**Performance Monitoring:**
- Google Analytics for user behavior
- Mixpanel for funnel analysis
- Custom metrics for API response times
- Database query performance monitoring

**Logging:**
- Winston for structured logging
- Log aggregation in production
- Searchable logs with request IDs
- Separate logs for audit trail

**Alerting:**
- Alert on error rate spikes
- Alert on API latency increases
- Alert on failed deployments
- Alert on security events


## Security Considerations

### Authentication & Authorization

**Password Security:**
- Bcrypt hashing with cost factor 12 (exceeds minimum requirement of 10)
- Passwords must be at least 8 characters
- No password complexity requirements (research shows they reduce security)
- Password reset via email/SMS OTP

**JWT Token Management:**
- Access tokens valid for 24 hours
- Refresh tokens valid for 30 days
- Tokens signed with RS256 (asymmetric)
- Token rotation on refresh
- Blacklist for revoked tokens (Redis)

**OTP Security:**
- 6-digit numeric OTPs
- 10-minute expiration
- Rate limited to 3 attempts per phone number per hour
- Secure random generation (crypto.randomInt)

**Session Management:**
- Stateless JWT-based sessions
- No server-side session storage
- Logout invalidates tokens via blacklist
- Concurrent session limit: 5 devices per user

### Input Validation & Sanitization

**Validation Strategy:**
- Zod schemas for all API inputs
- Validate on both client and server
- Whitelist approach (only allow known-good inputs)
- Reject requests with unexpected fields

**Sanitization:**
- HTML sanitization using DOMPurify (frontend)
- SQL injection prevention via parameterized queries (Firestore SDK handles this)
- XSS prevention via output encoding
- Path traversal prevention for file operations

**File Upload Security:**
- Validate file types via MIME type and magic bytes
- Scan uploaded files for malware (ClamAV or cloud service)
- Generate random filenames to prevent overwrites
- Store files outside web root
- Serve files via signed URLs with expiration

### API Security

**Rate Limiting:**
- Authentication endpoints: 5 requests/minute per IP
- API endpoints: 100 requests/minute per user
- File upload: 10 uploads/hour per user
- Search: 60 requests/minute per user
- Implement using express-rate-limit with Redis store

**CORS Configuration:**
```typescript
{
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}
```

**Security Headers:**
```typescript
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https://res.cloudinary.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(self), microphone=(self), camera=(self)'
}
```

### Data Protection

**Encryption:**
- TLS 1.3 for all communications
- Firebase handles encryption at rest
- Sensitive fields (phone, email) encrypted in logs
- Document files encrypted in Firebase Storage

**Data Minimization:**
- Collect only necessary PII
- Anonymize analytics data
- Delete inactive accounts after 2 years
- Purge old audit logs per retention policy

**Access Control:**
- Principle of least privilege
- Role-based access control (RBAC)
- Resource-level permissions (users can only access their own data)
- Admin actions require additional verification

**Privacy Compliance:**
- GDPR-compliant data handling
- Indian IT Act compliance
- User consent for data collection
- Right to access, export, and delete data
- Privacy policy and terms of service

### Infrastructure Security

**Deployment:**
- Environment variables for secrets (never commit)
- Separate environments (dev, staging, production)
- Immutable infrastructure (containers)
- Automated security updates

**Monitoring:**
- Failed login attempt monitoring
- Unusual activity detection
- Security event logging
- Automated alerts for security incidents

**Backup & Recovery:**
- Daily automated backups of Firestore
- Point-in-time recovery capability
- Backup encryption
- Regular restore testing

**Dependency Management:**
- Regular dependency updates
- Automated vulnerability scanning (npm audit, Snyk)
- Lock files committed to repository
- Review dependencies before adding

### Third-Party Service Security

**Cloudinary:**
- Signed uploads to prevent unauthorized access
- Transformation URLs signed to prevent abuse
- Access control on folders
- Regular access key rotation

**Algolia:**
- API key with minimal permissions
- Separate keys for indexing and searching
- Search-only key exposed to frontend
- Admin key kept server-side only

**Firebase:**
- Security rules for Firestore and Storage
- Service account with minimal permissions
- Regular audit of security rules
- Enable audit logging

**WebRTC:**
- TURN server with authentication
- Encrypted media streams (DTLS-SRTP)
- Signaling over secure WebSocket
- No P2P IP exposure (relay mode)

### Incident Response

**Security Incident Plan:**
1. Detect: Automated monitoring and alerts
2. Contain: Isolate affected systems
3. Investigate: Analyze logs and determine scope
4. Remediate: Fix vulnerability and restore service
5. Notify: Inform affected users if required
6. Review: Post-mortem and process improvement

**Contact:**
- Security team email: security@sahijagah.com
- Responsible disclosure program
- Bug bounty program (future consideration)


## Performance Considerations

### Frontend Performance

**Code Splitting:**
- Route-based code splitting with React.lazy
- Component-level splitting for heavy components
- Vendor bundle separation
- Dynamic imports for non-critical features

**Asset Optimization:**
- Image optimization via Cloudinary transformations
- Lazy loading for images below the fold
- WebP format with fallbacks
- Responsive images with srcset
- SVG for icons and illustrations

**Caching Strategy:**
- Service worker for offline support
- Cache API responses with React Query
- LocalStorage for user preferences
- IndexedDB for offline message queue

**Bundle Size:**
- Target: < 200KB initial bundle (gzipped)
- Tree shaking for unused code
- Analyze bundle with webpack-bundle-analyzer
- Remove unused dependencies

**Rendering Performance:**
- Virtual scrolling for long lists (react-window)
- Memoization with React.memo and useMemo
- Debounce search inputs
- Optimize re-renders with useCallback
- Lazy load below-the-fold content

### Backend Performance

**Database Optimization:**
- Firestore indexes for common queries
- Denormalization for read-heavy data
- Pagination for large result sets
- Batch operations where possible
- Connection pooling

**Caching:**
- Redis for session data and rate limiting
- Cache frequently accessed data (user profiles, property details)
- Cache invalidation on updates
- CDN caching for static assets
- API response caching with appropriate TTLs

**API Optimization:**
- Compression (gzip/brotli) for responses
- Field selection (return only requested fields)
- Batch endpoints to reduce round trips
- GraphQL consideration for flexible queries
- HTTP/2 for multiplexing

**Search Performance:**
- Algolia handles indexing and search
- Incremental index updates
- Faceted search for filters
- Geo-search for location-based queries
- Typo tolerance and synonyms

**Background Jobs:**
- Queue for async operations (email, notifications)
- Cron jobs for analytics aggregation
- Batch processing for bulk operations
- Retry logic with exponential backoff

### Scalability

**Horizontal Scaling:**
- Stateless API servers (scale with load)
- Serverless functions for variable load
- Auto-scaling based on metrics
- Load balancing across instances

**Database Scaling:**
- Firestore auto-scales
- Read replicas for read-heavy workloads
- Sharding strategy for future growth
- Archive old data to cold storage

**Media Scaling:**
- Cloudinary CDN for global distribution
- Automatic format and quality optimization
- Lazy loading and progressive images
- Video streaming with adaptive bitrate

**Real-time Scaling:**
- Firebase Realtime Database scales automatically
- Connection limits per user
- Message batching for high volume
- Fallback to polling if WebSocket fails

### Monitoring & Metrics

**Performance Metrics:**
- Time to First Byte (TTFB): < 200ms
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**API Metrics:**
- Response time: p50 < 100ms, p95 < 500ms, p99 < 1s
- Error rate: < 0.1%
- Throughput: requests per second
- Database query time

**Monitoring Tools:**
- Google Lighthouse for frontend performance
- Web Vitals tracking
- New Relic or Datadog for backend APM
- Firebase Performance Monitoring
- Custom metrics dashboard

## Deployment Architecture

### Environments

**Development:**
- Local development with Firebase emulators
- Hot reload for rapid iteration
- Mock external services
- Seed data for testing

**Staging:**
- Mirrors production configuration
- Separate Firebase project
- Test data only
- Automated deployments from main branch

**Production:**
- High availability configuration
- Automated backups
- Monitoring and alerting
- Blue-green deployment strategy

### Deployment Process

**Frontend (Netlify):**
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

**Backend (Vercel):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Alternative: Firebase Functions:**
```typescript
// firebase.json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ]
  }
}
```

### CI/CD Pipeline

**Automated Checks:**
- Linting (ESLint, Prettier)
- Type checking (TypeScript)
- Unit tests with coverage
- Property-based tests
- Integration tests
- Security scanning
- Dependency audit

**Deployment Gates:**
- All tests must pass
- Code review approval required
- No critical security vulnerabilities
- Coverage threshold met (70%)

**Rollback Strategy:**
- Keep previous 5 deployments
- One-click rollback in Netlify/Vercel
- Database migrations are reversible
- Feature flags for gradual rollout

### Environment Variables

**Required Variables:**
```bash
# Backend
NODE_ENV=production
PORT=3000
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>

# Firebase
FIREBASE_PROJECT_ID=<project-id>
FIREBASE_PRIVATE_KEY=<service-account-key>
FIREBASE_CLIENT_EMAIL=<service-account-email>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Algolia
ALGOLIA_APP_ID=<app-id>
ALGOLIA_ADMIN_KEY=<admin-key>
ALGOLIA_SEARCH_KEY=<search-key>

# Notifications
SENDGRID_API_KEY=<api-key>
TWILIO_ACCOUNT_SID=<account-sid>
TWILIO_AUTH_TOKEN=<auth-token>
TWILIO_PHONE_NUMBER=<phone-number>

# Frontend
VITE_API_URL=https://api.sahijagah.com
VITE_FIREBASE_CONFIG=<firebase-config-json>
VITE_ALGOLIA_APP_ID=<app-id>
VITE_ALGOLIA_SEARCH_KEY=<search-key>
VITE_CLOUDINARY_CLOUD_NAME=<cloud-name>
VITE_GOOGLE_MAPS_API_KEY=<api-key>
```

### Database Migrations

**Migration Strategy:**
- Firestore doesn't require traditional migrations
- Schema changes handled in application code
- Data migrations via scripts when needed
- Backward compatibility for gradual rollout

**Example Migration Script:**
```typescript
// migrations/001_add_favorites_count.ts
async function migrate() {
  const propertiesRef = db.collection('properties');
  const snapshot = await propertiesRef.get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { favoritesCount: 0 });
  });
  
  await batch.commit();
  console.log(`Updated ${snapshot.size} properties`);
}
```

### Disaster Recovery

**Backup Strategy:**
- Automated daily Firestore exports
- Backup retention: 30 days
- Stored in separate GCS bucket
- Encrypted at rest

**Recovery Procedures:**
1. Identify scope of data loss
2. Restore from most recent backup
3. Replay transaction logs if available
4. Verify data integrity
5. Resume normal operations

**RTO/RPO:**
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 24 hours

