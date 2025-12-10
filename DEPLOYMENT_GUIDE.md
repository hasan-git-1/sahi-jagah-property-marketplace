# Sahi Jagah - Deployment Guide

## Overview

This guide covers deploying Sahi Jagah to production environments. The application uses a modern serverless architecture with separate frontend and backend deployments.

## Prerequisites

- Node.js 18+ installed
- Git repository access
- Firebase project (production)
- Cloudinary account
- Algolia account
- SendGrid account
- Twilio account (optional)
- Netlify account (frontend)
- Vercel account (backend) OR Firebase Functions

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] Environment variables documented
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Database indexes created
- [ ] API documentation up to date

### 2. Firebase Setup
- [ ] Production Firebase project created
- [ ] Firebase Authentication enabled
- [ ] Firestore database created
- [ ] Firestore security rules deployed
- [ ] Firestore indexes created
- [ ] Firebase Storage configured
- [ ] Storage security rules deployed
- [ ] Firebase Realtime Database enabled
- [ ] Firebase Cloud Messaging configured

### 3. Third-Party Services
- [ ] Cloudinary production account configured
- [ ] Algolia production index created
- [ ] SendGrid production templates created
- [ ] Twilio DLT registration (India) completed
- [ ] All API keys obtained

### 4. Infrastructure
- [ ] Domain name purchased
- [ ] SSL certificates configured
- [ ] CDN configured
- [ ] Monitoring tools set up
- [ ] Backup strategy implemented

## Environment Variables

### Frontend (.env.production)
```env
# API
VITE_API_URL=https://api.sahijagah.com/api/v1

# Firebase
VITE_FIREBASE_API_KEY=your-production-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Analytics (Optional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
VITE_MIXPANEL_TOKEN=your-mixpanel-token
```

### Backend (.env.production)
```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1
FRONTEND_URL=https://sahijagah.com

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Algolia
ALGOLIA_APP_ID=your-app-id
ALGOLIA_API_KEY=your-admin-api-key
ALGOLIA_INDEX_NAME=properties_production

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@sahijagah.com
SENDGRID_FROM_NAME=Sahi Jagah

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX

# Redis (Production)
REDIS_URL=redis://your-redis-url:6379

# Sentry (Optional)
SENTRY_DSN=https://your-sentry-dsn
```

## Frontend Deployment (Netlify)

### Option 1: Netlify CLI

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Build the frontend**
```bash
cd frontend
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

### Option 2: Git Integration

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Build Settings**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add all VITE_* variables from .env.production

4. **Deploy**
   - Push to main branch
   - Netlify will automatically build and deploy

### Netlify Configuration (netlify.toml)

Create `frontend/netlify.toml`:
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Backend Deployment (Vercel)

### Option 1: Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd backend
vercel --prod
```

### Option 2: Git Integration

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory:** `backend`
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from .env.production

4. **Deploy**
   - Push to main branch
   - Vercel will automatically build and deploy

### Vercel Configuration (vercel.json)

Create `backend/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Alternative: Firebase Functions

### Deploy to Firebase Functions

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**
```bash
firebase login
```

3. **Initialize Functions**
```bash
firebase init functions
```

4. **Configure functions/package.json**
```json
{
  "engines": {
    "node": "18"
  },
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "npm run build && firebase deploy --only functions"
  }
}
```

5. **Deploy**
```bash
cd backend
npm run build
firebase deploy --only functions
```

## Database Setup

### 1. Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```

### 2. Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### 3. Deploy Storage Rules
```bash
firebase deploy --only storage
```

### 4. Seed Production Data (Optional)
```bash
cd backend
npm run seed
```

## Domain Configuration

### Frontend (Netlify)

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `sahijagah.com` and `www.sahijagah.com`

2. **Configure DNS**
   - Add A record: `@` → Netlify IP
   - Add CNAME: `www` → your-site.netlify.app

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificate
   - Force HTTPS in settings

### Backend (Vercel)

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add domain: `api.sahijagah.com`

2. **Configure DNS**
   - Add CNAME: `api` → your-project.vercel.app

3. **Update CORS**
   - Update `FRONTEND_URL` in backend environment variables
   - Redeploy backend

## Post-Deployment Tasks

### 1. Verify Deployment
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Database connections working
- [ ] File uploads working
- [ ] Search working
- [ ] Real-time messaging working
- [ ] Notifications working

### 2. Configure Monitoring

**Sentry (Error Tracking)**
```bash
# Frontend
npm install @sentry/react

# Backend
npm install @sentry/node
```

**Google Analytics**
```html
<!-- Add to frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-X"></script>
```

### 3. Set Up Backups

**Automated Firestore Backups**
```bash
# Create backup script
firebase deploy --only functions:scheduledFirestoreBackup
```

**Manual Backup**
```bash
cd backend
npm run backup
```

### 4. Performance Optimization

- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize images (Cloudinary)
- [ ] Enable compression
- [ ] Minify JavaScript/CSS

### 5. Security Hardening

- [ ] Review security headers
- [ ] Test rate limiting
- [ ] Verify RBAC enforcement
- [ ] Check input sanitization
- [ ] Review audit logs
- [ ] Test GDPR compliance

## Monitoring & Maintenance

### Health Checks

**Frontend**
```bash
curl https://sahijagah.com/health
```

**Backend**
```bash
curl https://api.sahijagah.com/health
```

### Log Monitoring

**Netlify Logs**
```bash
netlify logs
```

**Vercel Logs**
```bash
vercel logs
```

**Firebase Logs**
```bash
firebase functions:log
```

### Performance Monitoring

- **Lighthouse:** Run weekly audits
- **Uptime:** Set up uptime monitoring (UptimeRobot)
- **Analytics:** Review Google Analytics weekly

## Rollback Procedure

### Frontend Rollback (Netlify)
1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Backend Rollback (Vercel)
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Promote to Production"

### Database Rollback
```bash
cd backend
npm run restore backups/backup-YYYY-MM-DD.json
```

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Check `FRONTEND_URL` in backend environment
- Verify CORS configuration in backend/src/index.ts

**2. Authentication Failures**
- Verify Firebase configuration
- Check JWT secrets
- Verify token expiration times

**3. Database Connection Issues**
- Check Firebase credentials
- Verify Firestore security rules
- Check network connectivity

**4. File Upload Failures**
- Verify Cloudinary credentials
- Check file size limits
- Verify storage rules

**5. Search Not Working**
- Verify Algolia credentials
- Check index name
- Verify search indexing

## Support

- **Documentation:** https://docs.sahijagah.com
- **Status Page:** https://status.sahijagah.com
- **Support Email:** support@sahijagah.com
- **Emergency:** +91 7093187420

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0
