# Sahi Jagah - Developer Guide

## Getting Started

This guide will help you set up your development environment and understand the codebase structure.

## Prerequisites

- **Node.js:** 18+ (LTS recommended)
- **npm:** 9+ (comes with Node.js)
- **Git:** Latest version
- **Code Editor:** VS Code recommended
- **Firebase CLI:** `npm install -g firebase-tools`
- **Basic Knowledge:** TypeScript, React, Node.js, Express

## Initial Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd sahi-jagah
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# This will also install frontend and backend dependencies
```

### 3. Set Up Environment Variables

**Root .env**
```bash
cp .env.example .env
```

**Frontend .env**
```bash
cp frontend/.env.example frontend/.env
```

**Backend .env**
```bash
cp backend/.env.example backend/.env
```

Fill in all required values. See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed instructions.

### 4. Configure Firebase

Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) to:
- Create Firebase project
- Enable Authentication
- Set up Firestore
- Configure Storage
- Get credentials

### 5. Configure Third-Party Services

Follow [THIRD_PARTY_SETUP.md](./THIRD_PARTY_SETUP.md) to configure:
- Cloudinary (media storage)
- Algolia (search)
- SendGrid (email)
- Twilio (SMS/OTP)

### 6. Seed Database (Optional)
```bash
cd backend
npm run seed
```

This creates test accounts:
- admin@sahijagah.com / Test@1234
- owner@example.com / Test@1234
- agent@example.com / Test@1234
- client@example.com / Test@1234

### 7. Start Development Servers
```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

## Project Structure

```
sahi-jagah/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   │   ├── firebase.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── algolia.ts
│   │   │   ├── email.ts
│   │   │   ├── sms.ts
│   │   │   └── logger.ts
│   │   ├── controllers/    # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── propertyController.ts
│   │   │   ├── bookingController.ts
│   │   │   ├── messagingController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── adminController.ts
│   │   │   └── dataPrivacyController.ts
│   │   ├── middlewares/    # Express middlewares
│   │   │   ├── authMiddleware.ts
│   │   │   ├── rbacMiddleware.ts
│   │   │   ├── rateLimitMiddleware.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── sanitizeInput.ts
│   │   │   └── auditLog.ts
│   │   ├── models/         # Data models
│   │   │   ├── user.ts
│   │   │   ├── property.ts
│   │   │   ├── booking.ts
│   │   │   ├── favorite.ts
│   │   │   ├── notification.ts
│   │   │   └── conversation.ts
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   ├── propertyRoutes.ts
│   │   │   ├── searchRoutes.ts
│   │   │   ├── favoriteRoutes.ts
│   │   │   ├── bookingRoutes.ts
│   │   │   ├── messagingRoutes.ts
│   │   │   ├── notificationRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── dataPrivacyRoutes.ts
│   │   │   └── index.ts
│   │   ├── services/       # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── propertyService.ts
│   │   │   ├── bookingService.ts
│   │   │   ├── messagingService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── analyticsService.ts
│   │   │   └── dataExportService.ts
│   │   ├── scripts/        # Utility scripts
│   │   │   ├── seed.ts
│   │   │   ├── backup.ts
│   │   │   └── restore.ts
│   │   ├── docs/           # API documentation
│   │   │   └── openapi.yaml
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── HelpdeskWidget.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   └── ChatWindow.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── SignupPage.tsx
│   │   │   ├── properties/
│   │   │   │   ├── PropertyListPage.tsx
│   │   │   │   ├── PropertyDetailPage.tsx
│   │   │   │   └── CreatePropertyPage.tsx
│   │   │   ├── dashboards/
│   │   │   │   ├── OwnerDashboard.tsx
│   │   │   │   └── ClientDashboard.tsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboardPage.tsx
│   │   │   │   ├── AdminAnalyticsTab.tsx
│   │   │   │   ├── AdminUsersTab.tsx
│   │   │   │   └── AdminPropertiesTab.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── BookingsPage.tsx
│   │   │   ├── MessagesPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/      # API clients
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── propertyService.ts
│   │   │   ├── messagingService.ts
│   │   │   └── notificationService.ts
│   │   ├── store/         # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── messagingStore.ts
│   │   │   ├── notificationStore.ts
│   │   │   └── toastStore.ts
│   │   ├── routes/        # Route configuration
│   │   │   └── index.tsx
│   │   ├── config/        # Configuration
│   │   │   └── firebase.ts
│   │   ├── App.tsx        # App component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── tsconfig.json
├── .kiro/specs/           # Requirements, design, tasks
├── API_DOCUMENTATION.md   # Complete API reference
├── ARCHITECTURE.md        # Architecture documentation
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
├── DEVELOPER_GUIDE.md     # This file
├── README.md              # Project overview
└── package.json           # Root package.json
```

## Development Workflow

### 1. Create a New Feature

**Step 1: Create a branch**
```bash
git checkout -b feature/your-feature-name
```

**Step 2: Implement the feature**
Follow the layered architecture:
1. Create/update model in `backend/src/models/`
2. Create/update service in `backend/src/services/`
3. Create/update controller in `backend/src/controllers/`
4. Create/update routes in `backend/src/routes/`
5. Create/update frontend components/pages

**Step 3: Test your changes**
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

**Step 4: Commit and push**
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

**Step 5: Create pull request**
- Go to GitHub
- Create pull request
- Request review
- Merge after approval

### 2. Backend Development

#### Adding a New API Endpoint

**1. Define the model** (`backend/src/models/yourModel.ts`)
```typescript
export interface YourModel {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

**2. Create the service** (`backend/src/services/yourService.ts`)
```typescript
import { db } from '../config/firebase';

export class YourService {
  static async create(data: Partial<YourModel>): Promise<YourModel> {
    const docRef = await db.collection('yourCollection').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as YourModel;
  }
  
  static async getById(id: string): Promise<YourModel | null> {
    const doc = await db.collection('yourCollection').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as YourModel;
  }
}
```

**3. Create the controller** (`backend/src/controllers/yourController.ts`)
```typescript
import { Request, Response } from 'express';
import { YourService } from '../services/yourService';

export class YourController {
  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const result = await YourService.create(data);
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'Failed to create resource',
        },
      });
    }
  }
  
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await YourService.getById(id);
      
      if (!result) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
          },
        });
      }
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch resource',
        },
      });
    }
  }
}
```

**4. Create the routes** (`backend/src/routes/yourRoutes.ts`)
```typescript
import { Router } from 'express';
import { YourController } from '../controllers/yourController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { rbacMiddleware } from '../middlewares/rbacMiddleware';

const router = Router();

router.post('/', authMiddleware, rbacMiddleware(['admin']), YourController.create);
router.get('/:id', YourController.getById);

export default router;
```

**5. Register routes** (`backend/src/routes/index.ts`)
```typescript
import yourRoutes from './yourRoutes';

router.use('/your-resource', yourRoutes);
```

### 3. Frontend Development

#### Adding a New Page

**1. Create the page component** (`frontend/src/pages/YourPage.tsx`)
```typescript
import React from 'react';
import { Container, Typography } from '@mui/material';
import Layout from '../components/Layout';

const YourPage: React.FC = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Page Title
        </Typography>
        {/* Your content here */}
      </Container>
    </Layout>
  );
};

export default YourPage;
```

**2. Add route** (`frontend/src/routes/index.tsx`)
```typescript
import YourPage from '../pages/YourPage';

{
  path: '/your-path',
  element: <YourPage />,
}
```

**3. Add navigation** (`frontend/src/components/Header.tsx`)
```typescript
<MenuItem component={Link} to="/your-path">
  Your Page
</MenuItem>
```

#### Creating a Reusable Component

```typescript
import React from 'react';
import { Box, Typography } from '@mui/material';

interface YourComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

const YourComponent: React.FC<YourComponentProps> = ({
  title,
  description,
  onAction,
}) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {onAction && (
        <Button onClick={onAction}>Action</Button>
      )}
    </Box>
  );
};

export default YourComponent;
```

## Code Style Guide

### TypeScript

**Use explicit types**
```typescript
// Good
const user: User = { id: '1', name: 'John' };

// Avoid
const user = { id: '1', name: 'John' };
```

**Use interfaces for objects**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

**Use async/await over promises**
```typescript
// Good
const data = await fetchData();

// Avoid
fetchData().then(data => { ... });
```

### React

**Use functional components**
```typescript
// Good
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>{prop1}</div>;
};

// Avoid class components
```

**Use hooks**
```typescript
const [state, setState] = useState<string>('');
const data = useQuery('key', fetchFn);
```

**Extract complex logic to custom hooks**
```typescript
const useYourLogic = () => {
  const [state, setState] = useState();
  // ... logic
  return { state, setState };
};
```

### Naming Conventions

- **Files:** camelCase for utilities, PascalCase for components
- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Functions:** camelCase (e.g., `getUserById`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Interfaces:** PascalCase with 'I' prefix optional (e.g., `User` or `IUser`)

## Testing

### Backend Tests (Jest)

```typescript
import { UserService } from '../services/userService';

describe('UserService', () => {
  describe('create', () => {
    it('should create a user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
      };
      
      const user = await UserService.create(userData);
      
      expect(user).toHaveProperty('id');
      expect(user.email).toBe(userData.email);
    });
  });
});
```

### Frontend Tests (Vitest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders title', () => {
    render(<YourComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## Debugging

### Backend Debugging

**1. Use console.log (development only)**
```typescript
console.log('Debug:', variable);
```

**2. Use Winston logger**
```typescript
import { logger } from '../config/logger';

logger.info('Info message');
logger.error('Error message', error);
```

**3. Use VS Code debugger**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "preLaunchTask": "tsc: build - backend/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

### Frontend Debugging

**1. Use React DevTools**
- Install React DevTools browser extension
- Inspect component props and state

**2. Use browser console**
```typescript
console.log('Debug:', variable);
```

**3. Use VS Code debugger**
Set breakpoints in VS Code and use Chrome debugger.

## Common Tasks

### Add a New Dependency

**Backend**
```bash
cd backend
npm install package-name
npm install --save-dev @types/package-name
```

**Frontend**
```bash
cd frontend
npm install package-name
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

### Run Database Migrations

```bash
cd backend
npm run seed
```

### Backup Database

```bash
cd backend
npm run backup
```

### View API Documentation

```bash
# Start backend
npm run dev:backend

# Open browser
http://localhost:5000/api-docs
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Firebase Connection Issues

1. Check Firebase credentials in `.env`
2. Verify Firebase project is active
3. Check Firestore security rules
4. Verify network connectivity

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Material-UI Documentation](https://mui.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Getting Help

- **Documentation:** Check project documentation first
- **API Docs:** http://localhost:5000/api-docs
- **Team Chat:** Slack/Discord channel
- **Issues:** Create GitHub issue
- **Email:** dev@sahijagah.com

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0
