# Implementation Plan

- [ ] 1. Project Setup and Infrastructure
- [x] 1.1 Initialize monorepo structure with frontend and backend directories



  - Create root package.json with workspace configuration
  - Set up TypeScript configuration for both projects
  - Configure ESLint and Prettier with shared configs
  - Set up Husky for pre-commit hooks
  - _Requirements: 16.1, 16.2_



- [ ] 1.2 Initialize React frontend with Vite
  - Create React + TypeScript project with Vite
  - Install core dependencies (React Router, Zustand, React Query, Material-UI/Tailwind)
  - Set up folder structure (pages, components, services, hooks, store, styles)


  - Configure environment variables with .env.example
  - _Requirements: 14.1, 16.2_

- [ ] 1.3 Initialize Node.js backend with Express
  - Create Express + TypeScript project

  - Install core dependencies (Express, Firebase Admin, Zod, bcrypt, jsonwebtoken)
  - Set up folder structure (controllers, services, models, routes, middlewares)
  - Configure environment variables with .env.example
  - _Requirements: 16.2_

- [x] 1.4 Configure Firebase project and services

  - Create Firebase project for development
  - Enable Firebase Authentication (email/password and phone)
  - Set up Firestore database with security rules
  - Configure Firebase Storage for documents
  - Set up Firebase Cloud Messaging for notifications
  - Initialize Firebase Admin SDK in backend
  - _Requirements: 1.1, 1.2, 6.1_

- [x] 1.5 Set up third-party service integrations



  - Configure Cloudinary account and obtain API keys
  - Set up Algolia account and create search index
  - Configure SendGrid or email service for notifications
  - Set up Twilio for SMS/OTP (optional)
  - Add service configuration to environment variables
  - _Requirements: 2.2, 3.1, 10.3_


- [ ] 2. Authentication System
- [x] 2.1 Implement backend authentication service


  - Create AuthService with signup, login, OTP generation/verification
  - Implement password hashing with bcrypt (cost factor 12)
  - Implement JWT token generation and validation
  - Create token refresh mechanism
  - Add token blacklist using in-memory store (or Redis)
  - _Requirements: 1.1, 1.3, 13.1_

- [ ]* 2.2 Write property test for user registration
  - **Property 1: User registration creates account with correct role**
  - **Validates: Requirements 1.1**

- [ ]* 2.3 Write property test for JWT token expiration
  - **Property 2: JWT tokens are issued with correct expiration**
  - **Validates: Requirements 1.3**

- [ ]* 2.4 Write property test for OTP expiration
  - **Property 4: OTP expiration is enforced**
  - **Validates: Requirements 1.5**

- [x] 2.5 Implement authentication middleware and RBAC

  - Create authMiddleware to validate JWT tokens
  - Create rbacMiddleware to enforce role-based access control
  - Implement rate limiting middleware for auth endpoints
  - _Requirements: 1.4, 13.3_

- [ ]* 2.6 Write property test for RBAC enforcement
  - **Property 3: Protected resources enforce RBAC**
  - **Validates: Requirements 1.4**

- [x] 2.7 Create authentication API endpoints

  - POST /api/v1/auth/signup
  - POST /api/v1/auth/login
  - POST /api/v1/auth/otp/send
  - POST /api/v1/auth/otp/verify
  - POST /api/v1/auth/refresh
  - POST /api/v1/auth/logout
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2.8 Implement frontend authentication pages



  - Create LoginPage with email/phone and password/OTP options
  - Create SignupPage with role selection
  - Create OTPVerification component
  - Implement authentication state management with Zustand
  - Create ProtectedRoute component for route guards
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 2.9 Write unit tests for authentication flows
  - Test signup with email and phone
  - Test login with valid/invalid credentials
  - Test OTP generation and verification
  - Test token refresh
  - _Requirements: 1.1, 1.2, 1.3_


- [ ] 3. User Profile Management
- [x] 3.1 Implement user service and API endpoints


  - Create UserService with CRUD operations
  - Implement profile photo upload to Cloudinary
  - Create user preferences management
  - GET /api/v1/users/:id
  - PUT /api/v1/users/:id
  - DELETE /api/v1/users/:id (soft delete with data anonymization)
  - _Requirements: 18.3_

- [x] 3.2 Implement frontend profile page


  - Create ProfilePage component
  - Implement profile editing form with validation
  - Add profile photo upload with preview
  - Add notification preferences UI
  - _Requirements: 10.5_

- [ ]* 3.3 Write property test for notification preferences
  - **Property 42: Notification preferences are persisted**
  - **Validates: Requirements 10.5**

- [ ] 4. Property Listing System
- [x] 4.1 Implement property service and data models


  - Create PropertyService with CRUD operations
  - Implement property validation with Zod schemas
  - Create Firestore indexes for property queries
  - Implement property status management (active, inactive, rented, sold)
  - _Requirements: 2.1, 2.4_

- [ ]* 4.2 Write property test for property creation
  - **Property 5: Property creation sets pending status**
  - **Validates: Requirements 2.1**

- [ ]* 4.3 Write property test for property status and search
  - **Property 8: Inactive properties excluded from search**
  - **Validates: Requirements 2.4**

- [x] 4.4 Implement media upload service

  - Create StorageService for Cloudinary integration
  - Implement signed upload for images and videos
  - Add file validation (type, size)
  - Generate thumbnails for videos
  - _Requirements: 2.2, 2.5_

- [ ]* 4.5 Write property test for media upload
  - **Property 6: Media upload stores CDN URLs**
  - **Validates: Requirements 2.2**

- [ ]* 4.6 Write property test for file size validation
  - **Property 9: File size validation enforced**
  - **Validates: Requirements 2.5**

- [x] 4.7 Create property API endpoints


  - GET /api/v1/properties (list with filters)
  - POST /api/v1/properties (create)
  - GET /api/v1/properties/:id (detail)
  - PUT /api/v1/properties/:id (update)
  - DELETE /api/v1/properties/:id (soft delete)
  - POST /api/v1/properties/:id/media (upload)
  - DELETE /api/v1/properties/:id/media/:mediaId
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 4.8 Write property test for property updates
  - **Property 7: Property updates persist changes**
  - **Validates: Requirements 2.3**

- [x] 4.9 Implement frontend property form


  - Create PropertyForm component for create/edit
  - Implement multi-step form (details, location, amenities, media)
  - Add ImageUploader with drag-and-drop and preview
  - Add VideoUploader component
  - Integrate Google Maps for location selection
  - Add form validation with React Hook Form and Zod
  - _Requirements: 2.1, 2.2_

- [x] 4.10 Create property display components


  - Create PropertyCard for list view
  - Create PropertyDetailPage with gallery
  - Implement PropertyGallery with lightbox
  - Add VirtualTourViewer placeholder
  - Display property amenities and details
  - _Requirements: 2.1_


- [ ] 5. Search and Discovery
- [x] 5.1 Implement Algolia search integration

  - Create SearchService for Algolia operations
  - Implement property indexing on create/update
  - Configure search index with facets and geo-search
  - Implement index synchronization
  - _Requirements: 3.1, 3.4_

- [ ]* 5.2 Write property test for search indexing
  - **Property 12: Only verified active properties are indexed**
  - **Validates: Requirements 3.4**

- [x] 5.3 Create search API endpoint


  - GET /api/v1/properties with search and filter parameters
  - Implement city, price range, type, amenities filters
  - Add pagination support
  - Return results with relevance ranking
  - _Requirements: 3.1, 3.3_

- [ ]* 5.4 Write property test for search filtering
  - **Property 10: Search returns matching properties**
  - **Validates: Requirements 3.1, 3.3**

- [ ]* 5.5 Write property test for search result structure
  - **Property 11: Search results contain required fields**
  - **Validates: Requirements 3.2**

- [x] 5.6 Implement frontend search interface


  - Create PropertySearchPage with search bar
  - Implement FilterPanel with all filter options
  - Add map/list toggle view
  - Integrate MapView with Google Maps showing property markers
  - Implement infinite scroll or pagination
  - Add search result count and sorting options
  - _Requirements: 3.1, 3.2_

- [x] 5.7 Implement property view tracking


  - Add view counter increment on property detail view
  - Track views in analytics
  - _Requirements: 3.5_

- [ ]* 5.8 Write property test for view counting
  - **Property 13: Property views increment correctly**
  - **Validates: Requirements 3.5**

- [ ] 6. Favorites System
- [x] 6.1 Implement favorites service and API endpoints


  - Create favorites subcollection or separate collection
  - GET /api/v1/users/:id/favorites
  - POST /api/v1/users/:id/favorites (add)
  - DELETE /api/v1/users/:id/favorites/:propertyId (remove)
  - Implement cascade delete when property becomes inactive
  - _Requirements: 11.1, 11.3, 11.4_

- [ ]* 6.2 Write property test for favorites management
  - **Property 43: Favorites creation associates user and property**
  - **Property 45: Favorites removal deletes record**
  - **Validates: Requirements 11.1, 11.3**

- [ ]* 6.3 Write property test for favorites cascade
  - **Property 46: Inactive properties removed from favorites**
  - **Validates: Requirements 11.4**

- [ ]* 6.4 Write property test for unlimited favorites
  - **Property 47: No limit on favorites count**
  - **Validates: Requirements 11.5**

- [x] 6.5 Implement frontend favorites UI


  - Add favorite button to PropertyCard and PropertyDetailPage
  - Create favorites list in ClientDashboard
  - Show current property status and pricing in favorites
  - _Requirements: 11.2_

- [ ]* 6.6 Write property test for favorites display
  - **Property 44: Favorites list shows current property data**
  - **Validates: Requirements 11.2**


- [ ] 7. Booking and Visit Scheduling
- [x] 7.1 Implement booking service and data models


  - Create BookingService with CRUD operations
  - Implement booking state machine (requested, confirmed, cancelled, completed)
  - Add validation for booking dates (must be future)
  - Implement owner and client booking queries
  - _Requirements: 4.1, 4.3, 4.4_

- [ ]* 7.2 Write property test for booking creation
  - **Property 14: Booking creation sets requested status**
  - **Validates: Requirements 4.1**

- [ ]* 7.3 Write property test for booking state transitions
  - **Property 16: Booking state transitions are valid**
  - **Validates: Requirements 4.3, 4.4**

- [ ]* 7.4 Write property test for booking modifications
  - **Property 17: Booking modifications allowed in requested state**
  - **Validates: Requirements 4.5**

- [x] 7.2 Create booking API endpoints


  - GET /api/v1/bookings (list user's bookings)
  - POST /api/v1/bookings (create booking)
  - GET /api/v1/bookings/:id
  - PUT /api/v1/bookings/:id (confirm, cancel, update time)
  - _Requirements: 4.1, 4.3, 4.4, 4.5_

- [x] 7.3 Integrate booking notifications

  - Send notification on booking creation
  - Send notification on booking confirmation
  - Send notification on booking cancellation
  - _Requirements: 4.2_

- [ ]* 7.4 Write property test for booking notifications
  - **Property 15: Booking notifications sent to correct users**
  - **Validates: Requirements 4.2**

- [x] 7.5 Implement frontend booking UI



  - Create BookingCalendar component with date/time picker
  - Create BookingModal for booking request form
  - Create BookingCard to display booking details
  - Add BookingList to owner and client dashboards
  - Implement booking status badges and actions
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 9. Real-time Messaging System
- [ ] 9.1 Implement messaging service with Firebase Realtime Database
  - Create MessageService for conversation and message operations
  - Set up Firebase Realtime Database structure for conversations and messages
  - Implement real-time listeners for new messages
  - Add message read status tracking
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ]* 9.2 Write property test for conversation creation
  - **Property 18: Conversation creation includes both participants**
  - **Validates: Requirements 5.1**

- [ ]* 9.3 Write property test for message delivery
  - **Property 19: Messages are delivered to recipient**
  - **Validates: Requirements 5.2, 5.5**

- [ ]* 9.4 Write property test for message read status
  - **Property 21: Message read status tracked correctly**
  - **Validates: Requirements 5.4**

- [ ] 9.5 Implement message attachment handling
  - Add image upload to Cloudinary for message attachments
  - Store attachment URLs in message records
  - _Requirements: 5.3_

- [ ]* 9.6 Write property test for message attachments
  - **Property 20: Message attachments include CDN URLs**
  - **Validates: Requirements 5.3**

- [ ] 9.7 Create messaging API endpoints
  - GET /api/v1/conversations (list user's conversations)
  - POST /api/v1/conversations (start conversation)
  - GET /api/v1/conversations/:id
  - POST /api/v1/conversations/:id/messages (send message)
  - GET /api/v1/conversations/:id/messages (get messages)
  - PUT /api/v1/conversations/:id/messages/:messageId/read
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9.8 Implement frontend messaging UI
  - Create ConversationList component
  - Create ChatWindow with message thread
  - Create MessageInput with text and attachment support
  - Create MessageBubble for individual messages
  - Add AttachmentPreview for images
  - Implement real-time message updates
  - Add unread message indicators
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 9.9 Integrate message notifications
  - Send push notification for new messages
  - Only send if recipient is not viewing conversation
  - _Requirements: 10.2_

- [ ]* 9.10 Write property test for message notifications
  - **Property 40: Message notifications respect user state**
  - **Validates: Requirements 10.2**


- [x] 10. Document Verification System
- [x] 10.1 Implement document service
  - Create DocumentService for document upload and management
  - Implement secure document storage in Firebase Storage
  - Generate signed URLs with 1-hour expiration
  - Support PDF, JPG, PNG formats with 10MB limit
  - _Requirements: 6.1, 6.3, 6.4_

- [ ]* 10.2 Write property test for document upload
  - **Property 22: Document upload creates verification request**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 10.3 Write property test for document validation
  - **Property 23: Document format and size validation**
  - **Validates: Requirements 6.3**

- [ ]* 10.4 Write property test for signed URLs
  - **Property 24: Document access generates signed URLs**
  - **Validates: Requirements 6.4**

- [ ] 10.5 Create document API endpoints
  - POST /api/v1/properties/:id/documents (upload)
  - GET /api/v1/documents/:id (get with signed URL)
  - DELETE /api/v1/documents/:id
  - _Requirements: 6.1, 6.4_

- [ ] 10.6 Implement admin verification service
  - Create VerificationService for admin actions
  - Implement approve/reject workflow
  - Update property verification status
  - Create audit logs for verification actions
  - _Requirements: 7.2, 7.3, 7.5_

- [ ]* 10.7 Write property test for verification queue
  - **Property 25: Verification queue shows pending properties**
  - **Validates: Requirements 7.1**

- [ ]* 10.8 Write property test for verification approval
  - **Property 26: Verification approval updates status and notifies**
  - **Validates: Requirements 7.2, 7.4**

- [ ]* 10.9 Write property test for verification rejection
  - **Property 27: Verification rejection updates status with reason**
  - **Validates: Requirements 7.3**

- [ ]* 10.10 Write property test for audit logging
  - **Property 28: Verification actions are logged**
  - **Validates: Requirements 7.5**

- [ ] 10.11 Create admin verification API endpoints
  - GET /api/v1/admin/verification/pending
  - PUT /api/v1/admin/verification/:id/approve
  - PUT /api/v1/admin/verification/:id/reject
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 10.12 Implement frontend document upload UI
  - Create DocumentUploader component
  - Add document type selection
  - Show upload progress
  - Display uploaded documents with status
  - _Requirements: 6.1_

- [ ] 10.13 Implement admin verification UI
  - Create VerificationQueue component
  - Create VerificationCard for document review
  - Add approve/reject actions with reason input
  - Show verification history
  - _Requirements: 7.1, 7.2, 7.3_


- [ ] 11. Digital Lease System
- [ ] 11.1 Implement lease service
  - Create LeaseService for lease generation and management
  - Implement PDF generation using PDFKit or Puppeteer
  - Create lease template with property and party details
  - Implement signature tracking (flags and timestamps)
  - Store lease PDFs in Firebase Storage with 5-year signed URLs
  - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ]* 11.2 Write property test for lease PDF generation
  - **Property 29: Lease PDF contains all required information**
  - **Validates: Requirements 8.1**

- [ ]* 11.3 Write property test for lease initial state
  - **Property 30: New leases have unsigned flags**
  - **Validates: Requirements 8.2**

- [ ]* 11.4 Write property test for lease signing
  - **Property 31: Signing updates flag and timestamp**
  - **Validates: Requirements 8.3**

- [ ]* 11.5 Write property test for lease completion
  - **Property 32: Fully signed leases trigger email delivery**
  - **Validates: Requirements 8.4**

- [ ]* 11.6 Write property test for lease URL expiration
  - **Property 33: Lease documents have long-lived signed URLs**
  - **Validates: Requirements 8.5**

- [ ] 11.7 Create lease API endpoints
  - POST /api/v1/leases/generate
  - GET /api/v1/leases/:id
  - POST /api/v1/leases/:id/sign
  - GET /api/v1/leases/:id/download
  - _Requirements: 8.1, 8.3, 8.4_

- [ ] 11.8 Implement frontend lease UI
  - Create LeaseGenerator form component
  - Create LeasePreview with PDF viewer
  - Create SignatureCapture component (checkbox or drawn signature)
  - Create LeaseList showing user's leases
  - Add lease status indicators
  - _Requirements: 8.1, 8.3_

- [ ] 11.9 Integrate lease completion notifications
  - Send email with signed PDF when both parties sign
  - _Requirements: 8.4_


- [x] 12. Admin Dashboard and Analytics
- [x] 12.1 Implement analytics service
  - Create AnalyticsService for metrics aggregation
  - Implement dashboard metrics calculation (users, properties, bookings, conversations)
  - Create analytics aggregation by city and property type
  - Implement date range filtering
  - Calculate trends for registrations, listings, bookings
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [ ]* 12.2 Write property test for dashboard counts
  - **Property 34: Dashboard displays accurate counts**
  - **Validates: Requirements 9.1**

- [ ]* 12.3 Write property test for analytics aggregations
  - **Property 35: Analytics aggregations are correct**
  - **Validates: Requirements 9.2**

- [ ]* 12.4 Write property test for metrics updates
  - **Property 36: Dashboard metrics update with new data**
  - **Validates: Requirements 9.3**

- [ ]* 12.5 Write property test for date filtering
  - **Property 37: Date range filtering works correctly**
  - **Validates: Requirements 9.4**

- [ ]* 12.6 Write property test for trend calculations
  - **Property 38: Trend calculations are accurate**
  - **Validates: Requirements 9.5**

- [x] 12.7 Create admin API endpoints
  - GET /api/v1/admin/dashboard
  - GET /api/v1/admin/analytics
  - GET /api/v1/admin/users
  - PUT /api/v1/admin/users/:id/status
  - GET /api/v1/admin/properties
  - PUT /api/v1/admin/properties/:id/verify
  - _Requirements: 9.1, 9.2, 9.4_

- [x] 12.8 Implement frontend admin dashboard
  - Create AdminDashboard with metrics cards
  - Add charts for analytics (Chart.js or Recharts)
  - Implement date range picker for filtering
  - Show city and property type breakdowns
  - Display trend graphs
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [x] 12.9 Implement admin user management UI
  - Create user list with search and filters
  - Add user status management (active, suspended)
  - Show user activity and statistics
  - _Requirements: 7.1_

- [x] 12.10 Implement admin property management UI
  - Create property list with filters
  - Add quick verification actions
  - Show property statistics
  - _Requirements: 7.1, 7.4_


- [ ] 13. Notification System
- [ ] 13.1 Implement notification service
  - Create NotificationService for multi-channel notifications
  - Integrate Firebase Cloud Messaging for push notifications
  - Integrate SendGrid for email notifications
  - Integrate Twilio for SMS notifications (optional)
  - Implement notification preferences checking
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ]* 13.2 Write property test for event notifications
  - **Property 39: Notifications sent to affected users**
  - **Validates: Requirements 10.1, 10.3**

- [ ]* 13.3 Write property test for SMS preferences
  - **Property 41: SMS notifications respect user preferences**
  - **Validates: Requirements 10.4**

- [ ] 13.4 Create notification API endpoints
  - GET /api/v1/notifications
  - PUT /api/v1/notifications/:id/read
  - PUT /api/v1/notifications/read-all
  - _Requirements: 10.1_

- [ ] 13.5 Implement frontend notification UI
  - Create NotificationBell component with dropdown
  - Show unread count badge
  - Display notification list with timestamps
  - Add mark as read functionality
  - Implement real-time notification updates
  - _Requirements: 10.1_

- [ ] 13.6 Integrate notifications throughout the app
  - Add notification triggers for all events (bookings, messages, verifications)
  - Ensure notifications respect user preferences
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 14. WebRTC Calling System
- [ ] 14.1 Implement WebRTC service
  - Create CallService for WebRTC connection management
  - Integrate simple-peer library
  - Implement signaling via Firebase Realtime Database or Socket.io
  - Add call duration tracking
  - Implement fallback to helpdesk number on failure
  - _Requirements: 17.1, 17.2, 17.4_

- [ ]* 14.2 Write property test for WebRTC connections
  - **Property 55: WebRTC connections established for calls**
  - **Validates: Requirements 17.1**

- [ ]* 14.3 Write property test for call fallback
  - **Property 56: Call failures show fallback number**
  - **Validates: Requirements 17.2**

- [ ]* 14.4 Write property test for call logging
  - **Property 57: Call termination logs duration**
  - **Validates: Requirements 17.4**

- [ ]* 14.5 Write property test for call modes
  - **Property 58: Both audio and video modes supported**
  - **Validates: Requirements 17.5**

- [ ] 14.6 Implement frontend calling UI
  - Create call initiation button in chat
  - Create call modal with video/audio toggle
  - Show call duration and quality indicators
  - Display fallback number on connection failure (7093187420)
  - Add call end functionality
  - _Requirements: 17.1, 17.2, 17.5_


- [x] 15. Security and Compliance
- [x] 15.1 Implement security middleware
  - Add helmet for security headers (HSTS, CSP, X-Frame-Options)
  - Implement input sanitization middleware
  - Add CORS configuration
  - Implement request logging
  - _Requirements: 13.2, 13.4, 13.5_

- [ ]* 15.2 Write property test for password hashing
  - **Property 51: Passwords are hashed with bcrypt**
  - **Validates: Requirements 13.1**

- [ ]* 15.3 Write property test for rate limiting
  - **Property 52: Rate limiting enforced on auth endpoints**
  - **Validates: Requirements 13.3**

- [ ]* 15.4 Write property test for security headers
  - **Property 53: Security headers present on all responses**
  - **Validates: Requirements 13.4**

- [ ]* 15.5 Write property test for input sanitization
  - **Property 54: Malicious inputs are sanitized**
  - **Validates: Requirements 13.5**

- [x] 15.6 Implement data privacy features
  - Create data export functionality (JSON format)
  - Implement account deletion with data anonymization
  - Add audit logging for sensitive data access
  - _Requirements: 18.3, 18.4, 18.5_

- [ ]* 15.7 Write property test for account deletion
  - **Property 59: Account deletion removes personal data**
  - **Validates: Requirements 18.3**

- [ ]* 15.8 Write property test for data export
  - **Property 60: Data export returns complete JSON**
  - **Validates: Requirements 18.4**

- [ ]* 15.9 Write property test for audit logging
  - **Property 61: Sensitive data access is logged**
  - **Validates: Requirements 18.5**

- [ ] 16. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [x] 17. API Documentation and Error Handling
- [x] 17.1 Implement global error handling
  - Create error handler middleware
  - Implement consistent error response format
  - Add error logging with Sentry integration
  - Create custom error classes for different error types
  - _Requirements: 12.3, 12.4, 12.5_

- [ ]* 17.2 Write property test for validation errors
  - **Property 48: Invalid requests return 400 with details**
  - **Validates: Requirements 12.3**

- [ ]* 17.3 Write property test for authentication errors
  - **Property 49: Unauthenticated access returns 401**
  - **Validates: Requirements 12.4**

- [ ]* 17.4 Write property test for authorization errors
  - **Property 50: Unauthorized actions return 403**
  - **Validates: Requirements 12.5**

- [x] 17.5 Create OpenAPI specification
  - Document all API endpoints with request/response schemas
  - Include authentication requirements
  - Add example requests and responses
  - Generate Swagger UI for interactive documentation
  - _Requirements: 12.1_

- [x] 17.6 Create comprehensive API documentation
  - Create API_DOCUMENTATION.md with complete reference
  - Include quick start examples
  - Document all endpoints with examples
  - Add error codes and rate limits
  - _Requirements: 12.1, 12.2_

- [ ] 18. User Dashboards
- [ ] 18.1 Implement owner dashboard
  - Create OwnerDashboard component
  - Show property list with performance metrics
  - Display booking requests and history
  - Show analytics for owner's properties
  - Add quick actions (create property, view messages)
  - _Requirements: 2.1, 4.1_

- [ ] 18.2 Implement client dashboard
  - Create ClientDashboard component
  - Show saved favorites
  - Display booking history
  - Show recent searches
  - Add quick actions (search, view messages)
  - _Requirements: 11.2, 4.1_

- [ ] 18.3 Implement agent dashboard
  - Create AgentDashboard component
  - Show assigned properties
  - Display client interactions
  - Show performance metrics
  - _Requirements: 2.1_

- [x] 13. Notification System
- [x] 13.1 Implement notification service
  - Create NotificationService for multi-channel notifications
  - Integrate Firebase Cloud Messaging for push notifications
  - Integrate SendGrid for email notifications
  - Integrate Twilio for SMS notifications (optional)
  - Implement notification preferences checking
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 13.4 Create notification API endpoints
  - GET /api/v1/notifications
  - PUT /api/v1/notifications/:id/read
  - PUT /api/v1/notifications/read-all
  - _Requirements: 10.1_

- [x] 13.5 Implement frontend notification UI
  - Create NotificationBell component with dropdown
  - Show unread count badge
  - Display notification list with timestamps
  - Add mark as read functionality
  - Implement real-time notification updates
  - _Requirements: 10.1_

- [x] 13.6 Integrate notifications throughout the app
  - Add notification triggers for all events (bookings, messages, verifications)
  - Ensure notifications respect user preferences
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 19. Common UI Components and Layout
- [x] 19.1 Implement header and navigation
  - Create Header component with role-based menu
  - Add user profile dropdown
  - Implement responsive mobile menu
  - Add notification bell
  - _Requirements: 14.1_

- [x] 19.2 Implement footer and help
  - Create Footer with links and company info
  - Add HelpdeskWidget with phone (7093187420) and chat
  - _Requirements: 14.1_

- [x] 19.3 Create common UI components
  - LoadingSpinner for loading states
  - ErrorBoundary for error handling
  - Toast notifications for user feedback
  - Modal component for dialogs
  - Confirmation dialogs
  - _Requirements: 14.1_

- [x] 19.4 Implement responsive design
  - Ensure all pages work on mobile, tablet, desktop
  - Test responsive layouts
  - Optimize for touch interactions
  - _Requirements: 14.1_


- [x] 20. Database Setup and Seeding
- [x] 20.1 Create Firestore security rules
  - Define security rules for all collections
  - Implement role-based access control in rules
  - Add validation rules for data integrity
  - Test security rules with Firebase emulator
  - _Requirements: 13.4_

- [x] 20.2 Create database indexes
  - Define composite indexes for common queries
  - Add indexes for property search
  - Add indexes for user queries
  - Add indexes for booking queries
  - _Requirements: 3.1_

- [x] 20.3 Create seed script
  - Create seed script to populate test data
  - Add 4 users (admin, owner, client, agent) with known credentials
  - Add 5 sample properties across 3 cities (Hyderabad, Warangal, Vishakhapatnam)
  - Add sample bookings with various statuses
  - Add sample favorites and notifications
  - Make script idempotent (can run multiple times)
  - _Requirements: 16.4_

- [x] 20.4 Create migration utilities
  - Create utility scripts for data migrations
  - Add backup and restore scripts
  - Document migration procedures
  - _Requirements: 16.3_

- [x] 21. Testing Infrastructure
- [x] 21.1 Set up testing frameworks
  - Configure Jest for backend unit tests
  - Configure Vitest for frontend unit tests
  - Set up React Testing Library
  - Configure fast-check for property-based tests
  - Set up test coverage reporting
  - _Requirements: 15.1_

- [x] 21.2 Create test utilities and fixtures
  - Create test data factories
  - Create mock services
  - Create test helpers for authentication
  - Create custom generators for property-based tests
  - _Requirements: 15.1_

- [x] 21.3 Set up integration testing
  - Configure Supertest for API integration tests
  - Set up test database (Firebase emulator)
  - Create integration test helpers
  - _Requirements: 15.2_

- [x] 21.4 Set up E2E testing
  - Configure Playwright
  - Create E2E test helpers
  - Write E2E tests for critical flows (signup, property creation, booking, messaging)
  - _Requirements: 15.4_

- [ ]* 21.5 Run all property-based tests
  - Execute all 61 property tests
  - Verify 100+ iterations per test
  - Fix any failing properties
  - Document any edge cases found


- [x] 22. CI/CD and Deployment




- [ ] 22.1 Set up GitHub Actions workflow
  - Create CI workflow for linting and testing
  - Add test coverage reporting
  - Configure automated deployments
  - Add deployment to staging on main branch
  - Add production deployment workflow
  - _Requirements: 15.3, 15.5_


- [ ] 22.2 Configure Netlify deployment
  - Create netlify.toml configuration
  - Set up environment variables
  - Configure redirects for SPA routing
  - Set up preview deployments for PRs

  - _Requirements: 16.5_

- [ ] 22.3 Configure backend deployment
  - Set up Vercel or Firebase Functions deployment
  - Configure environment variables
  - Set up custom domain

  - Configure CORS for frontend domain
  - _Requirements: 16.5_

- [ ] 22.4 Set up monitoring and logging
  - Integrate Sentry for error tracking
  - Set up Google Analytics
  - Configure Mixpanel for funnel analysis
  - Set up log aggregation
  - Configure alerting for critical errors
  - _Requirements: 9.1_

- [x] 23. Documentation and Handover
- [x] 23.1 Create comprehensive README
  - Document project structure
  - Add setup instructions for local development
  - Document environment variables
  - Add deployment instructions
  - Include troubleshooting guide
  - _Requirements: 16.1_

- [x] 23.2 Document API usage
  - Finalize OpenAPI specification
  - Create API usage guide
  - Document authentication flow
  - Add code examples for common operations
  - _Requirements: 12.1_

- [x] 23.3 Create developer documentation
  - Document architecture decisions
  - Create database schema documentation
  - Document security considerations
  - Add contribution guidelines
  - _Requirements: 16.1_

- [x] 23.4 Create operational runbook
  - Document deployment procedures
  - Add monitoring and alerting setup
  - Document backup and recovery procedures
  - Add incident response procedures
  - Create maintenance checklist
  - _Requirements: 16.5_

- [x] 23.5 Prepare demo credentials
  - Create admin account for testing
  - Create sample owner, client, agent accounts
  - Document all test credentials
  - _Requirements: 16.4_

- [ ] 24. Final Checkpoint - Complete Testing and QA
  - Ensure all tests pass, ask the user if questions arise.
  - Run full test suite (unit, property-based, integration, E2E)
  - Verify all 61 correctness properties pass
  - Test all critical user flows manually
  - Verify deployment to staging
  - Check security headers and HTTPS
  - Verify all environment variables are documented
  - Test with sample data
  - Verify admin credentials work
  - Check API documentation is complete
