# Getting Started with Sahi Jagah

Welcome to the Sahi Jagah property marketplace project! This guide will help you get the application up and running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** (comes with Node.js)
- **Git**
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd sahi-jagah

# Install dependencies for all workspaces
npm install
```

This will install dependencies for both frontend and backend.

### 2. Set Up Environment Variables

#### Root Directory
```bash
cp .env.example .env
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# Edit frontend/.env and add your API keys
```

#### Backend
```bash
cd backend
cp .env.example .env
# Edit backend/.env and add your API keys
```

### 3. Set Up Third-Party Services

You'll need to set up accounts and get API keys for:

1. **Firebase** (Authentication, Database, Storage)
   - Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   
2. **Cloudinary** (Media storage)
3. **Algolia** (Search)
4. **SendGrid** (Email)
5. **Twilio** (SMS - Optional)

See [THIRD_PARTY_SETUP.md](./THIRD_PARTY_SETUP.md) for detailed instructions.

### 4. Start Development Servers

```bash
# From root directory - starts both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend only (http://localhost:5173)
npm run dev:backend   # Backend only (http://localhost:3000)
```

### 5. Verify Setup

1. **Frontend**: Open http://localhost:5173
   - You should see the Sahi Jagah homepage
   
2. **Backend**: Open http://localhost:3000/health
   - You should see: `{"status":"ok","timestamp":"..."}`

3. **API**: Open http://localhost:3000/api/v1/health
   - You should see: `{"success":true,"data":{...}}`

## 📁 Project Structure

```
sahi-jagah/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── routes/       # Route configuration
│   │   ├── services/     # API services
│   │   ├── store/        # State management (Zustand)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── styles/       # Global styles and theme
│   │   └── config/       # Configuration files
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Express middlewares
│   │   ├── config/       # Configuration files
│   │   └── utils/        # Utility functions
│   └── package.json
│
├── .kiro/specs/          # Project specifications
│   └── sahi-jagah-property-marketplace/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
│
├── firestore.rules       # Firestore security rules
├── storage.rules         # Firebase Storage rules
├── firebase.json         # Firebase configuration
└── package.json          # Root package.json (monorepo)
```

## 🛠️ Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Frontend tests only
cd frontend && npm test

# Backend tests only
cd backend && npm test
```

### Linting and Formatting

```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

### Building for Production

```bash
# Build all projects
npm run build

# Build frontend only
cd frontend && npm run build

# Build backend only
cd backend && npm run build
```

## 🔧 Common Tasks

### Adding a New Feature

1. Check the task list in `.kiro/specs/sahi-jagah-property-marketplace/tasks.md`
2. Mark the task as in progress
3. Implement the feature following the design document
4. Write tests
5. Mark the task as complete

### Adding a New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Create service in `backend/src/services/`
3. Add route in `backend/src/routes/`
4. Add validation schema
5. Write tests
6. Update API documentation

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/routes/index.tsx`
3. Create necessary components
4. Add to navigation if needed
5. Write tests

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Firebase Connection Issues

- Verify your Firebase credentials in `.env`
- Check if Firebase services are enabled in console
- Try using Firebase emulators for local development

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npm run build
```

## 📚 Documentation

- [Requirements Document](./.kiro/specs/sahi-jagah-property-marketplace/requirements.md)
- [Design Document](./.kiro/specs/sahi-jagah-property-marketplace/design.md)
- [Implementation Tasks](./.kiro/specs/sahi-jagah-property-marketplace/tasks.md)
- [Firebase Setup](./FIREBASE_SETUP.md)
- [Third-Party Services Setup](./THIRD_PARTY_SETUP.md)
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 🎯 Next Steps

Now that your development environment is set up, you can:

1. **Explore the codebase**: Familiarize yourself with the project structure
2. **Review the specs**: Read the requirements and design documents
3. **Start implementing**: Pick a task from the task list and start coding
4. **Run tests**: Ensure everything works as expected
5. **Contribute**: Follow the contribution guidelines

## 🤝 Getting Help

- Check the documentation in `.kiro/specs/`
- Review the setup guides (FIREBASE_SETUP.md, THIRD_PARTY_SETUP.md)
- Check the troubleshooting section above
- Contact: 7093187420 (Helpdesk)

## 📝 Development Tips

1. **Use TypeScript**: Take advantage of type safety
2. **Write tests**: Aim for good test coverage
3. **Follow conventions**: Use ESLint and Prettier
4. **Commit often**: Make small, focused commits
5. **Document changes**: Update docs when adding features
6. **Review specs**: Always refer to requirements and design docs

## 🔐 Security Reminders

- Never commit `.env` files
- Never commit API keys or secrets
- Use environment variables for all sensitive data
- Keep dependencies updated
- Follow security best practices

---

Happy coding! 🚀

Built with ❤️ for Indian tier-2/tier-3 cities
