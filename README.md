# Sahi Jagah - Property Marketplace

> A trusted property marketplace for rentals & sales in Indian tier-2/tier-3 cities

[![Status](https://img.shields.io/badge/status-MVP%20Complete-success)](./PROJECT_COMPLETION_SUMMARY.md)
[![License](https://img.shields.io/badge/license-Proprietary-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/typescript-5.1.6-blue)]()

## 🎯 Overview

Sahi Jagah is a full-stack property marketplace platform designed specifically for Indian tier-2 and tier-3 cities like Hyderabad, Warangal, and Vishakhapatnam. The platform connects property owners, agents, and clients with features like real-time messaging, booking system, and advanced search.

### ✨ Key Features

- 🔐 **Multi-channel Authentication** - Email/password and phone/OTP login
- 🏠 **Property Listings** - Create, edit, and manage property listings with media
- 🔍 **Advanced Search** - Algolia-powered search with filters and geo-location
- ⭐ **Favorites System** - Save and manage favorite properties
- 📅 **Booking System** - Schedule property visits with notifications
- 💬 **Real-time Messaging** - Chat with property owners with image attachments
- 🔔 **Multi-channel Notifications** - In-app, email, and SMS notifications
- 📊 **Role-based Dashboards** - Customized dashboards for owners, clients, and admins
- 👨‍💼 **Admin Panel** - Analytics, user management, and property verification
- 🔒 **GDPR Compliance** - Data export and account deletion

## 🏗️ Project Structure

```
sahi-jagah/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Firebase, Cloudinary, Algolia, Email, SMS
│   │   ├── controllers/ # Request handlers
│   │   ├── middlewares/ # Auth, RBAC, Rate limiting, Security
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── scripts/     # Seed, backup, restore
│   │   └── docs/        # OpenAPI specification
│   └── package.json
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API clients
│   │   ├── store/       # Zustand state management
│   │   └── routes/      # Route configuration
│   └── package.json
├── .kiro/specs/         # Requirements, design, tasks
├── API_DOCUMENTATION.md # Complete API documentation
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Firebase** account (Auth, Firestore, Storage, Realtime DB)
- **Cloudinary** account (media storage)
- **Algolia** account (search)
- **SendGrid** account (email notifications)
- **Twilio** account (SMS/OTP - optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sahi-jagah
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy example files and fill in your credentials:
   ```bash
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```

   See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed configuration.

4. **Configure third-party services**
   - [Firebase Setup](./FIREBASE_SETUP.md) - Auth, Firestore, Storage
   - [Third-party Setup](./THIRD_PARTY_SETUP.md) - Cloudinary, Algolia, SendGrid, Twilio

5. **Seed the database** (optional)
   ```bash
   cd backend
   npm run seed
   ```

   This creates test accounts:
   - **Admin:** admin@sahijagah.com / Test@1234
   - **Owner:** owner@example.com / Test@1234
   - **Agent:** agent@example.com / Test@1234
   - **Client:** client@example.com / Test@1234

6. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

### Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Seed database
npm run seed

# Backup database
npm run backup

# Restore database
npm run restore <backup-file>
```

## 📚 Documentation

### Project Documentation
- [📋 Requirements](.kiro/specs/sahi-jagah-property-marketplace/requirements.md) - 18 requirements, 90+ acceptance criteria
- [🎨 Design Document](.kiro/specs/sahi-jagah-property-marketplace/design.md) - Architecture and 61 correctness properties
- [✅ Implementation Tasks](.kiro/specs/sahi-jagah-property-marketplace/tasks.md) - 24 major tasks with subtasks
- [📊 Project Status](./PROJECT_COMPLETION_SUMMARY.md) - Current completion status
- [🚀 Getting Started](./GETTING_STARTED.md) - Detailed setup guide

### API Documentation
- [📖 API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [🔧 OpenAPI Spec](./backend/src/docs/openapi.yaml) - Machine-readable API spec
- [🌐 Swagger UI](http://localhost:5000/api-docs) - Interactive API explorer

### Setup Guides
- [🔥 Firebase Setup](./FIREBASE_SETUP.md) - Firebase configuration
- [🔌 Third-party Setup](./THIRD_PARTY_SETUP.md) - Cloudinary, Algolia, SendGrid, Twilio

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔍 Code Quality

```bash
# Lint all code
npm run lint

# Format all code
npm run format

# Type check
npm run type-check
```

## 🏗️ Building for Production

```bash
# Build all projects
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

## 📦 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI)
- **State Management:** Zustand
- **Server State:** React Query
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Real-time:** Firebase Realtime Database

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database:** Firebase Firestore
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
- **Authentication:** Firebase Auth
- **Database:** Firestore
- **Storage:** Firebase Storage + Cloudinary
- **Search:** Algolia
- **Hosting:** Netlify (frontend), Vercel/Firebase Functions (backend)
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (planned)

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Client** | Search properties, save favorites, book visits, message owners |
| **Owner** | Create/manage properties, respond to bookings, chat with clients |
| **Agent** | Same as owner, can manage multiple properties |
| **Admin** | Verify properties, manage users, view analytics, moderate content |

## 🔐 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Bcrypt password hashing (cost factor 12)
- ✅ Rate limiting (5 auth/min, 3 OTP/hour)
- ✅ Input sanitization and XSS protection
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ CORS configuration
- ✅ Audit logging for sensitive operations
- ✅ GDPR compliance (data export, account deletion)
- ✅ Signed URLs for document access

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/otp/send` - Send OTP to phone
- `POST /api/v1/auth/otp/verify` - Verify OTP and login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Properties
- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/:id` - Get property details
- `PUT /api/v1/properties/:id` - Update property
- `DELETE /api/v1/properties/:id` - Delete property

### Search
- `GET /api/v1/search` - Search properties with Algolia

### Bookings
- `GET /api/v1/bookings` - List bookings
- `POST /api/v1/bookings` - Create booking
- `PUT /api/v1/bookings/:id/confirm` - Confirm booking
- `PUT /api/v1/bookings/:id/cancel` - Cancel booking

### Messaging
- `GET /api/v1/conversations` - List conversations
- `POST /api/v1/conversations` - Start conversation
- `POST /api/v1/conversations/:id/messages` - Send message

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard metrics
- `GET /api/v1/admin/analytics` - Analytics data
- `PUT /api/v1/admin/properties/:id/verify` - Verify property

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🎨 Features by Role

### Client Dashboard
- View saved favorites
- Upcoming property visits
- Recent searches
- Quick actions (search, messages)

### Owner Dashboard
- Property performance metrics
- Booking requests
- Property list with stats
- Quick actions (create property, messages)

### Admin Dashboard
- Platform analytics
- User management
- Property verification queue
- System metrics

## 📱 Screenshots

*Coming soon*

## 🚀 Deployment

### Frontend (Netlify)
```bash
npm run build:frontend
# Deploy dist/ folder to Netlify
```

### Backend (Vercel/Firebase Functions)
```bash
npm run build:backend
# Deploy to Vercel or Firebase Functions
```

See deployment guides in documentation.

## 🔧 Environment Variables

### Backend
```env
PORT=5000
NODE_ENV=development
API_VERSION=v1
FRONTEND_URL=http://localhost:5173

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Algolia
ALGOLIA_APP_ID=your-app-id
ALGOLIA_API_KEY=your-api-key

# SendGrid
SENDGRID_API_KEY=your-api-key

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 📞 Support

- **Helpdesk:** +91 7093187420
- **Email:** support@sahijagah.com
- **Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a proprietary project. Please contact the maintainers for contribution guidelines.

## 📈 Project Status

**Status:** MVP Complete - Production Ready  
**Completion:** 12/24 major tasks (50%)  
**Last Updated:** December 9, 2025

See [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md) for detailed status.

---

Built with ❤️ for Indian tier-2/tier-3 cities
