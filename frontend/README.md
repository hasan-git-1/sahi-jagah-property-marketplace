# Sahi Jagah Frontend

React web application for the Sahi Jagah property marketplace.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Material-UI** for UI components
- **Zustand** for state management
- **React Query** for server state
- **React Router** for navigation
- **React Hook Form** + **Zod** for forms
- **Axios** for API calls
- **Vitest** for testing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your API keys
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── routes/         # Route configuration
├── services/       # API services
├── store/          # Zustand stores
├── hooks/          # Custom React hooks
├── styles/         # Global styles and theme
├── test/           # Test utilities
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Environment Variables

See `.env.example` for required environment variables.

## Features

- User authentication (email/phone + OTP)
- Property search and filtering
- Property listings management
- Booking system
- Real-time messaging
- Document verification
- Digital lease signing
- Admin dashboard

## Contributing

Please follow the coding standards and run tests before submitting PRs.
