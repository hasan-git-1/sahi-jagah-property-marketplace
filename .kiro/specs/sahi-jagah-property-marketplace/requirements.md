# Requirements Document

## Introduction

Sahi Jagah is a production-grade full-stack property marketplace web application designed for rentals and sales in Indian tier-2 and tier-3 cities. The system provides a trusted platform connecting property owners, clients (renters/buyers), and agents through features including property listings, verification workflows, visit scheduling, real-time communication, paperless lease management, and comprehensive analytics. The application prioritizes security, scalability, and user experience while maintaining compliance with Indian data privacy regulations.

## Glossary

- **System**: The Sahi Jagah web application including frontend, backend, and integrated services
- **Owner**: A user who lists properties for rent or sale
- **Client**: A user searching for properties to rent or buy
- **Agent**: A user who facilitates property transactions between owners and clients
- **Admin**: A user with moderation and verification privileges
- **Property Listing**: A record containing property details, media, location, and pricing information
- **Verification**: The process of validating property documents and user credentials
- **Booking**: A scheduled visit request for a property
- **Conversation**: A messaging thread between two users
- **Lease**: A digital rental agreement with e-signature capability
- **Cloudinary**: Cloud-based media storage and delivery service
- **Firebase**: Backend-as-a-Service platform for authentication, database, and notifications
- **Algolia**: Search and discovery API service
- **WebRTC**: Real-time communication protocol for voice/video calls

## Requirements

### Requirement 1

**User Story:** As a new user, I want to register and authenticate using email or phone number, so that I can access the platform securely with my chosen role.

#### Acceptance Criteria

1. WHEN a user submits registration details with name, email or phone, role selection, and optional password, THEN the System SHALL create a new user account with the specified role
2. WHEN a user selects phone-based authentication, THEN the System SHALL send an OTP to the provided phone number within 30 seconds
3. WHEN a user submits valid login credentials (email/phone and password/OTP), THEN the System SHALL authenticate the user and issue a JWT token valid for 24 hours
4. WHEN an authenticated user accesses protected resources, THEN the System SHALL validate the JWT token and enforce role-based access control
5. WHERE a user chooses phone authentication, the System SHALL support OTP verification with a 10-minute expiration window

### Requirement 2

**User Story:** As an owner, I want to create and manage property listings with comprehensive details and media, so that potential clients can discover and evaluate my properties.

#### Acceptance Criteria

1. WHEN an owner submits a property listing with title, description, type, price, address, and amenities, THEN the System SHALL create a new property record with status set to pending verification
2. WHEN an owner uploads images or videos for a property, THEN the System SHALL store the media files in Cloudinary and save the CDN URLs in the property record
3. WHEN an owner updates property details, THEN the System SHALL persist the changes and update the search index within 5 minutes
4. WHEN an owner marks a property as inactive, THEN the System SHALL exclude the property from public search results immediately
5. THE System SHALL validate that uploaded images do not exceed 10MB per file and videos do not exceed 100MB per file

### Requirement 3

**User Story:** As a client, I want to search and filter properties based on location, price, type, and amenities, so that I can find properties matching my requirements efficiently.

#### Acceptance Criteria

1. WHEN a client enters a search query with city, price range, property type, or amenities, THEN the System SHALL return matching properties ranked by relevance within 2 seconds
2. WHEN search results are displayed, THEN the System SHALL show property title, price, location, primary image, and key amenities for each result
3. WHEN a client applies multiple filters simultaneously, THEN the System SHALL return properties satisfying all filter criteria
4. THE System SHALL index all verified and active properties in the search engine
5. WHEN a client views a property from search results, THEN the System SHALL increment the property views counter by one

### Requirement 4

**User Story:** As a client, I want to request and schedule property visits, so that I can inspect properties before making rental or purchase decisions.

#### Acceptance Criteria

1. WHEN a client requests a visit for a property with a preferred date and time, THEN the System SHALL create a booking record with status set to requested
2. WHEN a booking is created, THEN the System SHALL send notifications to both the property owner and the requesting client within 1 minute
3. WHEN an owner confirms a booking, THEN the System SHALL update the booking status to confirmed and notify the client
4. WHEN an owner or client cancels a booking, THEN the System SHALL update the booking status to cancelled and notify the other party
5. WHILE a booking is in requested status, the System SHALL allow the owner to modify the scheduled time before confirmation

### Requirement 5

**User Story:** As a user, I want to communicate with other users through in-app messaging, so that I can discuss property details and coordinate visits without sharing personal contact information.

#### Acceptance Criteria

1. WHEN a user initiates a conversation with another user, THEN the System SHALL create a conversation record with both users as participants
2. WHEN a user sends a message in a conversation, THEN the System SHALL deliver the message to the recipient in real-time with latency under 3 seconds
3. WHEN a user sends an image attachment, THEN the System SHALL upload the image to Cloudinary and include the CDN URL in the message
4. WHEN a user receives a new message, THEN the System SHALL mark the message as unread until the user views the conversation
5. THE System SHALL persist all messages and maintain conversation history indefinitely

### Requirement 6

**User Story:** As an owner, I want to upload verification documents for my properties, so that clients can trust the authenticity of my listings.

#### Acceptance Criteria

1. WHEN an owner uploads verification documents for a property, THEN the System SHALL store the documents securely with signed URLs and create a verification request
2. WHEN verification documents are uploaded, THEN the System SHALL set the property verification status to pending
3. THE System SHALL support document uploads in PDF, JPG, and PNG formats with maximum file size of 10MB
4. WHEN a document is accessed, THEN the System SHALL generate a signed URL valid for 1 hour
5. THE System SHALL encrypt all stored documents at rest

### Requirement 7

**User Story:** As an admin, I want to review and approve property verification requests, so that only legitimate properties appear on the platform.

#### Acceptance Criteria

1. WHEN an admin accesses the verification queue, THEN the System SHALL display all properties with pending verification status ordered by submission date
2. WHEN an admin approves a verification request, THEN the System SHALL update the property verification status to approved and notify the owner
3. WHEN an admin rejects a verification request with a reason, THEN the System SHALL update the property verification status to rejected and notify the owner with the rejection reason
4. WHEN a property is approved, THEN the System SHALL make the property visible in public search results
5. THE System SHALL log all verification actions with admin user ID, timestamp, and decision for audit purposes

### Requirement 8

**User Story:** As an owner or client, I want to generate and sign digital lease agreements, so that I can complete rental transactions without physical paperwork.

#### Acceptance Criteria

1. WHEN an owner and client agree on lease terms, THEN the System SHALL generate a lease PDF document containing property details, parties information, and lease terms
2. WHEN a lease PDF is generated, THEN the System SHALL create a lease record with signed flags set to false for both parties
3. WHEN an owner or client signs the lease, THEN the System SHALL update the corresponding signed flag to true and record the signature timestamp
4. WHEN both parties have signed the lease, THEN the System SHALL send the final signed PDF to both parties via email
5. THE System SHALL store all lease documents with signed URLs valid for 5 years

### Requirement 9

**User Story:** As an admin, I want to view platform analytics and metrics, so that I can monitor system performance and user engagement.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard, THEN the System SHALL display total counts of users, properties, bookings, and active conversations
2. WHEN an admin views analytics, THEN the System SHALL show property views, inquiries, and conversion rates aggregated by city and property type
3. THE System SHALL update dashboard metrics in real-time with data latency under 5 minutes
4. WHEN an admin filters analytics by date range, THEN the System SHALL display metrics for the specified period
5. THE System SHALL track and display user registration trends, property listing trends, and booking completion rates

### Requirement 10

**User Story:** As a user, I want to receive timely notifications about bookings, messages, and verification updates, so that I can respond promptly to important events.

#### Acceptance Criteria

1. WHEN a booking is created, confirmed, or cancelled, THEN the System SHALL send push notifications to affected users within 1 minute
2. WHEN a user receives a new message, THEN the System SHALL send a push notification if the user is not currently viewing the conversation
3. WHEN a property verification status changes, THEN the System SHALL send an email notification to the property owner
4. WHERE a user has enabled SMS notifications, the System SHALL send SMS alerts for critical events including booking confirmations
5. THE System SHALL allow users to configure notification preferences for each notification type

### Requirement 11

**User Story:** As a client, I want to save favorite properties, so that I can easily access properties I am interested in without searching again.

#### Acceptance Criteria

1. WHEN a client marks a property as favorite, THEN the System SHALL create a favorite record associating the client with the property
2. WHEN a client views their favorites list, THEN the System SHALL display all saved properties with current status and pricing
3. WHEN a client removes a property from favorites, THEN the System SHALL delete the favorite record immediately
4. WHEN a favorited property becomes inactive or is deleted, THEN the System SHALL remove it from the client's favorites list
5. THE System SHALL allow clients to add unlimited properties to their favorites list

### Requirement 12

**User Story:** As a developer, I want comprehensive API documentation and testing tools, so that I can integrate with and test the platform efficiently.

#### Acceptance Criteria

1. THE System SHALL provide an OpenAPI specification documenting all API endpoints with request/response schemas
2. THE System SHALL include a Postman collection with example requests for all API endpoints
3. WHEN an API request fails validation, THEN the System SHALL return a 400 status code with detailed error messages indicating which fields are invalid
4. WHEN an unauthenticated user accesses a protected endpoint, THEN the System SHALL return a 401 status code
5. WHEN a user attempts an unauthorized action, THEN the System SHALL return a 403 status code with an explanation

### Requirement 13

**User Story:** As a system administrator, I want the application to be securely deployable to production environments, so that user data and platform integrity are protected.

#### Acceptance Criteria

1. THE System SHALL hash all passwords using bcrypt with a minimum cost factor of 10
2. THE System SHALL enforce HTTPS for all client-server communication
3. THE System SHALL implement rate limiting on authentication endpoints allowing maximum 5 requests per minute per IP address
4. THE System SHALL set security headers including HSTS, CSP, and X-Frame-Options on all responses
5. THE System SHALL validate and sanitize all user inputs to prevent SQL injection and XSS attacks

### Requirement 14

**User Story:** As a user, I want the application to be responsive and accessible, so that I can use it effectively on any device and regardless of my abilities.

#### Acceptance Criteria

1. WHEN a user accesses the application on mobile, tablet, or desktop devices, THEN the System SHALL render a responsive layout optimized for the device screen size
2. THE System SHALL support keyboard navigation for all interactive elements
3. THE System SHALL provide alternative text for all images
4. WHEN page content loads, THEN the System SHALL display content within 3 seconds on a standard broadband connection
5. THE System SHALL maintain WCAG 2.1 Level A compliance for accessibility

### Requirement 15

**User Story:** As a developer, I want automated testing and continuous integration, so that code quality is maintained and deployments are reliable.

#### Acceptance Criteria

1. THE System SHALL include unit tests achieving minimum 70% code coverage for backend services
2. THE System SHALL include integration tests for all API endpoints
3. WHEN code is pushed to the repository, THEN the System SHALL execute automated tests and report results within 10 minutes
4. THE System SHALL include end-to-end tests for critical user flows including signup, property creation, booking, and messaging
5. WHEN all tests pass, THEN the System SHALL automatically deploy to staging environment

### Requirement 16

**User Story:** As a new developer, I want clear setup and deployment documentation, so that I can run the application locally and deploy it to production.

#### Acceptance Criteria

1. THE System SHALL include a README file with step-by-step instructions for local development setup
2. THE System SHALL provide an .env.example file documenting all required environment variables
3. THE System SHALL include database migration scripts that can be executed to set up the schema
4. THE System SHALL include a seed script that populates the database with sample data including 10 properties across 3 cities
5. THE System SHALL provide deployment instructions for Netlify (frontend) and Vercel or Firebase (backend)

### Requirement 17

**User Story:** As an owner or agent, I want to initiate voice or video calls with clients, so that I can provide detailed property information and answer questions in real-time.

#### Acceptance Criteria

1. WHEN a user initiates a call with another user, THEN the System SHALL establish a WebRTC connection between the two users
2. WHEN a WebRTC connection fails, THEN the System SHALL display the helpdesk phone number 7093187420 as a fallback option
3. WHEN a call is in progress, THEN the System SHALL display call duration and connection quality indicators
4. WHEN a user ends a call, THEN the System SHALL terminate the connection and log the call duration
5. THE System SHALL support both audio-only and video call modes

### Requirement 18

**User Story:** As a user, I want my personal data to be handled in compliance with privacy regulations, so that my information is protected and used appropriately.

#### Acceptance Criteria

1. THE System SHALL store only essential personally identifiable information required for platform functionality
2. THE System SHALL encrypt all PII at rest using AES-256 encryption
3. WHEN a user requests account deletion, THEN the System SHALL remove all personal data within 30 days while retaining anonymized transaction records for legal compliance
4. THE System SHALL provide users with the ability to export their personal data in JSON format
5. THE System SHALL log all access to sensitive user data for audit purposes
