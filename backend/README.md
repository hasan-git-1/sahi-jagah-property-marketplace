# Sahi Jagah Backend

Node.js API server for the Sahi Jagah property marketplace.

## Tech Stack

- **Node.js** with **Express**
- **TypeScript**
- **Firebase Admin SDK** (Firestore, Auth, Storage)
- **Cloudinary** for media storage
- **Algolia** for search
- **Zod** for validation
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Winston** for logging
- **Jest** for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Firebase project
- Cloudinary account
- Algolia account

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys and configuration
```

### Development

```bash
# Start development server with hot reload
npm run dev
```

The API will be available at http://localhost:3000

### Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Linting

```bash
# Lint code
npm run lint
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── services/       # Business logic
├── models/         # Data models and types
├── routes/         # API routes
├── middlewares/    # Express middlewares
├── utils/          # Utility functions
└── index.ts        # Entry point
```

## API Documentation

API documentation will be available at `/api/v1/docs` (Swagger UI) once implemented.

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/otp/send` - Send OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Properties
- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/:id` - Get property
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Bookings
- `GET /api/v1/bookings` - List bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings/:id` - Get booking
- `PUT /api/v1/bookings/:id` - Update booking

### Messaging
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Start conversation
- `POST /api/v1/conversations/:id/messages` - Send message

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard metrics
- `GET /api/v1/admin/verification/pending` - Verification queue
- `PUT /api/v1/admin/verification/:id/approve` - Approve verification

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting
- Input validation and sanitization
- Security headers (Helmet)
- CORS configuration

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {},
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "unique-request-id"
  }
}
```

## Contributing

Please follow the coding standards and run tests before submitting PRs.
