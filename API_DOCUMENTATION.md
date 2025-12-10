# Sahi Jagah API Documentation

## Overview

Sahi Jagah is a full-stack property marketplace platform designed for Indian tier-2 and tier-3 cities. This document provides comprehensive API documentation for developers.

## Base URL

- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://api.sahijagah.com/api/v1`

## Interactive Documentation

Visit `/api-docs` for interactive Swagger UI documentation:
- **Development:** http://localhost:5000/api-docs
- **Production:** https://api.sahijagah.com/api-docs

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### Token Lifecycle

- **Access Token:** Valid for 24 hours
- **Refresh Token:** Valid for 30 days
- Use `/auth/refresh` endpoint to get a new access token

## Quick Start

### 1. Register a New User

```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "phone": "+919876543210",
  "role": "client",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "role": "client",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2. Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### 3. Search Properties

```bash
GET /search?query=apartment&city=Hyderabad&propertyType=rent&minPrice=10000&maxPrice=50000
```

### 4. Create a Property (Owner/Agent only)

```bash
POST /properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "3BHK Luxury Apartment",
  "description": "Spacious apartment in prime location",
  "price": 45000,
  "propertyType": "rent",
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1800,
  "city": "Hyderabad",
  "address": "Banjara Hills",
  "location": {
    "lat": 17.4239,
    "lng": 78.4738
  },
  "amenities": ["parking", "gym", "security"]
}
```

### 5. Schedule a Visit

```bash
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "propertyId": "prop123",
  "scheduledDate": "2025-12-15T10:00:00Z",
  "notes": "Interested in viewing this weekend"
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/otp/send` | Send OTP to phone | No |
| POST | `/auth/otp/verify` | Verify OTP and login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout and blacklist token | Yes |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/:id` | Get user profile | Yes |
| PUT | `/users/:id` | Update user profile | Yes (Own profile) |
| DELETE | `/users/:id` | Delete user account | Yes (Own profile) |
| POST | `/users/:id/photo` | Upload profile photo | Yes (Own profile) |

### Properties

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/properties` | List properties with filters | No |
| POST | `/properties` | Create property | Yes (Owner/Agent) |
| GET | `/properties/:id` | Get property details | No |
| PUT | `/properties/:id` | Update property | Yes (Owner) |
| DELETE | `/properties/:id` | Delete property | Yes (Owner) |
| POST | `/properties/:id/media` | Upload property media | Yes (Owner) |
| DELETE | `/properties/:id/media/:mediaId` | Delete media | Yes (Owner) |

### Search

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/search` | Search properties with Algolia | No |

**Query Parameters:**
- `query` - Search text
- `city` - Filter by city
- `propertyType` - rent or sale
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `bedrooms` - Number of bedrooms
- `amenities` - Comma-separated amenities

### Favorites

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/favorites` | Get user's favorites | Yes |
| POST | `/favorites` | Add to favorites | Yes |
| DELETE | `/favorites/:propertyId` | Remove from favorites | Yes |
| GET | `/favorites/:propertyId/status` | Check if favorited | Yes |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/bookings` | Get user's bookings | Yes |
| POST | `/bookings` | Create booking | Yes |
| GET | `/bookings/:id` | Get booking details | Yes |
| PUT | `/bookings/:id/confirm` | Confirm booking | Yes (Owner) |
| PUT | `/bookings/:id/cancel` | Cancel booking | Yes |
| PUT | `/bookings/:id/complete` | Mark as completed | Yes (Owner) |

### Messaging

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/conversations` | List conversations | Yes |
| POST | `/conversations` | Start conversation | Yes |
| GET | `/conversations/:id` | Get conversation details | Yes |
| GET | `/conversations/:id/messages` | Get messages | Yes |
| POST | `/conversations/:id/messages` | Send message | Yes |
| PUT | `/conversations/:id/messages/:messageId/read` | Mark as read | Yes |
| GET | `/conversations/unread-count` | Get unread count | Yes |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get notifications | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/read-all` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard` | Get dashboard metrics | Yes (Admin) |
| GET | `/admin/analytics` | Get analytics data | Yes (Admin) |
| GET | `/admin/users` | List all users | Yes (Admin) |
| PUT | `/admin/users/:id/status` | Update user status | Yes (Admin) |
| GET | `/admin/properties` | List all properties | Yes (Admin) |
| PUT | `/admin/properties/:id/verify` | Verify property | Yes (Admin) |

### Data Privacy (GDPR)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/privacy/export` | Export user data | Yes |
| DELETE | `/privacy/account` | Delete account | Yes |

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

- **Authentication endpoints:** 5 requests per minute
- **OTP endpoints:** 3 requests per hour
- **General API:** 100 requests per minute

## Pagination

List endpoints support pagination:

```bash
GET /properties?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

## File Uploads

### Property Images

- **Max size:** 10MB per image
- **Formats:** JPG, PNG, WebP
- **Endpoint:** `POST /properties/:id/media`

### Property Videos

- **Max size:** 100MB per video
- **Formats:** MP4, WebM
- **Endpoint:** `POST /properties/:id/media`

### Profile Photos

- **Max size:** 5MB
- **Formats:** JPG, PNG
- **Dimensions:** 400x400 (face-centered)
- **Endpoint:** `POST /users/:id/photo`

## Webhooks (Future)

Webhook support for real-time events:

- `booking.created`
- `booking.confirmed`
- `booking.cancelled`
- `message.received`
- `property.verified`

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @sahijagah/api-client
```

```typescript
import { SahiJagahClient } from '@sahijagah/api-client';

const client = new SahiJagahClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

const properties = await client.properties.search({
  city: 'Hyderabad',
  propertyType: 'rent'
});
```

## Support

- **Email:** support@sahijagah.com
- **Phone:** +91 7093187420
- **Documentation:** https://docs.sahijagah.com
- **Status Page:** https://status.sahijagah.com

## Changelog

### v1.0.0 (December 2025)
- Initial release
- Authentication with email/phone
- Property listings and search
- Booking system
- Real-time messaging
- Admin dashboard
- Notification system

---

**Last Updated:** December 9, 2025
