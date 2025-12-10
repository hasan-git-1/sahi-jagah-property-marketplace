# 🚀 Sahi Jagah - Complete Deployment & Launch Guide

**Last Updated:** December 9, 2025  
**Status:** Ready for Production Deployment

---

## 📋 Overview

This guide will walk you through deploying Sahi Jagah to production in **5 days**. Follow each step carefully.

---

## 🎯 Timeline

- **Day 1:** Firebase & Third-Party Services Setup
- **Day 2:** GitHub Secrets & Deployment Platform Setup
- **Day 3:** Deploy to Staging & Testing
- **Day 4:** QA Testing & Bug Fixes
- **Day 5:** Production Deployment & Launch

---

# DAY 1: Firebase & Third-Party Services Setup

## Step 1.1: Create Production Firebase Project (30 minutes)

### 1. Go to Firebase Console
```
https://console.firebase.google.com/
```

### 2. Create New Project
- Click "Add project"
- Project name: `sahi-jagah-production`
- Enable Google Analytics (recommended)
- Click "Create project"

### 3. Enable Authentication
- Go to **Authentication** → **Sign-in method**
- Enable **Email/Password**
- Enable **Phone** (for OTP)
  - Add test phone numbers if needed
  - Configure reCAPTCHA settings

### 4. Create Firestore Database
- Go to **Firestore Database** → **Create database**
- Start in **production mode**
- Choose location: `asia-south1` (Mumbai, India)
- Click "Enable"

### 5. Set Up Firestore Security Rules
- Go to **Firestore Database** → **Rules**
- Copy content from `firestore.rules` in your project
- Publish rules

### 6. Create Firestore Indexes
- Go to **Firestore Database** → **Indexes**
- Copy content from `firestore.indexes.json`
- Create each composite index manually:
  - Properties: `ownerId`, `status`, `createdAt`
  - Properties: `city`, `status`, `createdAt`
  - Properties: `type`, `status`, `createdAt`
  - Bookings: `clientId`, `status`, `visitDate`
  - Bookings: `ownerId`, `status`, `visitDate`

### 7. Set Up Firebase Storage
- Go to **Storage** → **Get started**
- Start in **production mode**
- Choose location: `asia-south1`
- Copy content from `storage.rules`
- Publish rules

### 8. Set Up Realtime Database
- Go to **Realtime Database** → **Create database**
- Start in **locked mode**
- Choose location: `asia-south1`
- Set up rules:
```json
{
  "rules": {
    "conversations": {
      "$conversationId": {
        ".read": "auth != null && (data.child('participants').child(auth.uid).exists())",
        ".write": "auth != null && (data.child('participants').child(auth.uid).exists())"
      }
    },
    "messages": {
      "$conversationId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

### 9. Enable Cloud Messaging
- Go to **Cloud Messaging** → **Get started**
- No additional setup needed

### 10. Get Firebase Configuration
- Go to **Project Settings** → **General**
- Scroll to "Your apps"
- Click "Add app" → Web (</>) icon
- App nickname: `sahi-jagah-web`
- Check "Also set up Firebase Hosting"
- Register app
- Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app"
};
```

### 11. Generate Service Account Key
- Go to **Project Settings** → **Service accounts**
- Click "Generate new private key"
- Save the JSON file securely (you'll need this for backend)

---

## Step 1.2: Set Up Cloudinary (15 minutes)

### 1. Create Cloudinary Account
```
https://cloudinary.com/users/register/free
```

### 2. Get API Credentials
- Go to Dashboard
- Copy:
  - Cloud Name
  - API Key
  - API Secret

### 3. Configure Upload Presets
- Go to **Settings** → **Upload**
- Create preset: `sahi-jagah-properties`
  - Signing Mode: Signed
  - Folder: `properties`
  - Allowed formats: jpg, png, webp
  - Max file size: 10 MB
  - Transformation: Auto quality, Auto format

- Create preset: `sahi-jagah-profiles`
  - Signing Mode: Signed
  - Folder: `profiles`
  - Allowed formats: jpg, png
  - Max file size: 5 MB
  - Transformation: Face detection, 400x400 crop

---

## Step 1.3: Set Up Algolia (15 minutes)

### 1. Create Algolia Account
```
https://www.algolia.com/users/sign_up
```

### 2. Create Application
- Application name: `sahi-jagah`
- Region: `India (Mumbai)`

### 3. Create Index
- Go to **Indices**
- Create index: `properties`

### 4. Configure Index Settings
- Go to index → **Configuration**
- Searchable attributes (in order):
  1. `title`
  2. `description`
  3. `city`
  4. `locality`
- Attributes for faceting:
  - `city`
  - `type`
  - `status`
  - `verified`
- Custom ranking:
  - `desc(createdAt)`
  - `desc(views)`

### 5. Get API Keys
- Go to **API Keys**
- Copy:
  - Application ID
  - Search-Only API Key
  - Admin API Key (for backend)

---

## Step 1.4: Set Up SendGrid (15 minutes)

### 1. Create SendGrid Account
```
https://signup.sendgrid.com/
```

### 2. Verify Sender Identity
- Go to **Settings** → **Sender Authentication**
- Verify single sender: `noreply@sahijagah.com`
- Or verify domain: `sahijagah.com`

### 3. Create API Key
- Go to **Settings** → **API Keys**
- Create API Key: `sahi-jagah-production`
- Permissions: Full Access
- Copy and save the API key

### 4. Create Email Templates (Optional)
- Go to **Email API** → **Dynamic Templates**
- Create templates for:
  - Welcome email
  - OTP email
  - Booking confirmation
  - Property verification

---

## Step 1.5: Set Up Twilio (20 minutes)

### 1. Create Twilio Account
```
https://www.twilio.com/try-twilio
```

### 2. Get Phone Number
- Go to **Phone Numbers** → **Buy a number**
- Choose India (+91) number
- Enable SMS capability

### 3. Get API Credentials
- Go to **Console Dashboard**
- Copy:
  - Account SID
  - Auth Token

### 4. Configure Messaging Service
- Go to **Messaging** → **Services**
- Create service: `sahi-jagah`
- Add your phone number to the service

### 5. DLT Registration (India Requirement)
**Important:** For sending SMS in India, you need DLT registration
- Register on DLT portal: https://www.vilpower.in/
- Register your business
- Register message templates
- Get Entity ID and Template IDs
- This can take 2-3 days

**Alternative:** Use test mode for now, complete DLT later

---

## Step 1.6: Document All Credentials (15 minutes)

Create a secure file `production-credentials.txt` (DO NOT commit to Git):

```
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_DATABASE_URL=
FIREBASE_SERVICE_ACCOUNT_KEY=<paste entire JSON>

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Algolia
ALGOLIA_APP_ID=
ALGOLIA_SEARCH_KEY=
ALGOLIA_ADMIN_KEY=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@sahijagah.com

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_MESSAGING_SERVICE_SID=

# Other
JWT_SECRET=<generate random 64 character string>
JWT_REFRESH_SECRET=<generate random 64 character string>
```

**Generate JWT Secrets:**
```bash
# Run in terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

# DAY 2: GitHub Secrets & Deployment Platforms

## Step 2.1: Set Up GitHub Secrets (30 minutes)

### 1. Go to GitHub Repository
```
https://github.com/YOUR_USERNAME/sahi-jagah
```

### 2. Navigate to Secrets
- Go to **Settings** → **Secrets and variables** → **Actions**

### 3. Add All Secrets

Click "New repository secret" for each:

**Firebase Secrets (8):**
```
VITE_API_URL = https://api.sahijagah.com
VITE_FIREBASE_API_KEY = <from Firebase>
VITE_FIREBASE_AUTH_DOMAIN = <from Firebase>
VITE_FIREBASE_PROJECT_ID = <from Firebase>
VITE_FIREBASE_STORAGE_BUCKET = <from Firebase>
VITE_FIREBASE_MESSAGING_SENDER_ID = <from Firebase>
VITE_FIREBASE_APP_ID = <from Firebase>
VITE_FIREBASE_DATABASE_URL = <from Firebase>
```

**Backend Environment (will add after Vercel setup):**
```
FIREBASE_SERVICE_ACCOUNT_KEY = <entire JSON from Firebase>
CLOUDINARY_CLOUD_NAME = <from Cloudinary>
CLOUDINARY_API_KEY = <from Cloudinary>
CLOUDINARY_API_SECRET = <from Cloudinary>
ALGOLIA_APP_ID = <from Algolia>
ALGOLIA_ADMIN_KEY = <from Algolia>
SENDGRID_API_KEY = <from SendGrid>
SENDGRID_FROM_EMAIL = noreply@sahijagah.com
TWILIO_ACCOUNT_SID = <from Twilio>
TWILIO_AUTH_TOKEN = <from Twilio>
TWILIO_PHONE_NUMBER = <from Twilio>
JWT_SECRET = <generated secret>
JWT_REFRESH_SECRET = <generated secret>
NODE_ENV = production
```

---

## Step 2.2: Set Up Netlify (30 minutes)

### 1. Create Netlify Account
```
https://app.netlify.com/signup
```

### 2. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 3. Login to Netlify
```bash
netlify login
```

### 4. Create Staging Site
```bash
netlify sites:create --name sahi-jagah-staging
```
- Copy the Site ID

### 5. Create Production Site
```bash
netlify sites:create --name sahi-jagah
```
- Copy the Site ID

### 6. Get Netlify Auth Token
- Go to https://app.netlify.com/user/applications
- Click "New access token"
- Name: `GitHub Actions`
- Copy the token

### 7. Add Netlify Secrets to GitHub
```
NETLIFY_AUTH_TOKEN = <token from step 6>
NETLIFY_STAGING_SITE_ID = <from step 4>
NETLIFY_PRODUCTION_SITE_ID = <from step 5>
```

### 8. Configure Environment Variables in Netlify
For both staging and production sites:
- Go to site → **Site settings** → **Environment variables**
- Add all `VITE_*` variables from GitHub secrets

---

## Step 2.3: Set Up Vercel (30 minutes)

### 1. Create Vercel Account
```
https://vercel.com/signup
```

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Link Project
```bash
cd backend
vercel link
```
- Create new project
- Name: `sahi-jagah-backend`
- Link to existing directory

### 5. Get Vercel Credentials
```bash
# Get token
vercel whoami

# Get project info
vercel project ls
```

Or from dashboard:
- Go to https://vercel.com/account/tokens
- Create token: `GitHub Actions`
- Go to project settings
- Copy Organization ID and Project ID

### 6. Add Vercel Secrets to GitHub
```
VERCEL_TOKEN = <token>
VERCEL_ORG_ID = <org ID>
VERCEL_PROJECT_ID = <project ID>
```

### 7. Configure Environment Variables in Vercel
- Go to project → **Settings** → **Environment Variables**
- Add all backend environment variables:
  - `FIREBASE_SERVICE_ACCOUNT_KEY`
  - `CLOUDINARY_*`
  - `ALGOLIA_*`
  - `SENDGRID_*`
  - `TWILIO_*`
  - `JWT_*`
  - `NODE_ENV=production`

---

## Step 2.4: Optional - Set Up Sentry (20 minutes)

### 1. Create Sentry Account
```
https://sentry.io/signup/
```

### 2. Create Project
- Platform: JavaScript
- Project name: `sahi-jagah`

### 3. Get DSN
- Copy the DSN from project settings

### 4. Add to Environment Variables
- Add `VITE_SENTRY_DSN` to Netlify
- Add `SENTRY_DSN` to Vercel

---

# DAY 3: Deploy to Staging

## Step 3.1: Prepare Code for Deployment (30 minutes)

### 1. Create develop Branch
```bash
git checkout -b develop
git push origin develop
```

### 2. Update Frontend Environment
Edit `frontend/.env.example`:
```env
VITE_API_URL=https://sahi-jagah-backend.vercel.app
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_here
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_DATABASE_URL=your_database_url_here
```

### 3. Update Backend Environment
Edit `backend/.env.example` with all required variables

### 4. Test Locally
```bash
# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Run tests
npm test

# Build
cd backend && npm run build
cd ../frontend && npm run build
```

---

## Step 3.2: Deploy to Staging (15 minutes)

### 1. Push to develop Branch
```bash
git add .
git commit -m "chore: prepare for staging deployment"
git push origin develop
```

### 2. Monitor GitHub Actions
- Go to GitHub → **Actions** tab
- Watch the CI/CD pipeline run
- Check for any errors

### 3. Verify Staging Deployment
- Frontend: Check Netlify dashboard for staging deploy
- Backend: Check Vercel dashboard for deployment
- URLs will be:
  - Frontend: `https://sahi-jagah-staging.netlify.app`
  - Backend: `https://sahi-jagah-backend-staging.vercel.app`

---

## Step 3.3: Seed Staging Database (15 minutes)

### 1. Update Firebase Config in Seed Script
Edit `backend/src/scripts/seed.ts` to use production Firebase

### 2. Run Seed Script
```bash
cd backend
npm run seed
```

### 3. Verify Data
- Go to Firebase Console
- Check Firestore for test data:
  - 4 users (admin, owner, agent, client)
  - 5 properties
  - Sample bookings

---

## Step 3.4: Test Staging Environment (1 hour)

### Test Checklist:

**Authentication:**
- [ ] Sign up with email
- [ ] Sign up with phone/OTP
- [ ] Login with email
- [ ] Login with phone/OTP
- [ ] Logout
- [ ] Token refresh

**Properties:**
- [ ] Create property (as owner)
- [ ] Upload images
- [ ] Edit property
- [ ] View property details
- [ ] Search properties
- [ ] Filter properties

**Bookings:**
- [ ] Schedule visit (as client)
- [ ] Confirm booking (as owner)
- [ ] Cancel booking
- [ ] View bookings

**Messaging:**
- [ ] Start conversation
- [ ] Send message
- [ ] Send image
- [ ] Real-time updates

**Admin:**
- [ ] Login as admin
- [ ] View dashboard
- [ ] Verify property
- [ ] Manage users

**Test Credentials:**
```
Admin: admin@sahijagah.com / Test@1234
Owner: owner@example.com / Test@1234
Agent: agent@example.com / Test@1234
Client: client@example.com / Test@1234
```

---

# DAY 4: QA Testing & Bug Fixes

## Step 4.1: Comprehensive QA Testing (4 hours)

### Browser Testing
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Device Testing
Test on:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone, Android)

### Feature Testing
Go through each feature systematically:
- [ ] All authentication flows
- [ ] All property operations
- [ ] All booking operations
- [ ] All messaging operations
- [ ] All admin operations
- [ ] All notification types

### Performance Testing
- [ ] Page load times (<3s)
- [ ] Image loading
- [ ] Search response time
- [ ] Real-time message delivery

### Security Testing
- [ ] Try accessing protected routes without auth
- [ ] Try accessing other users' data
- [ ] Try SQL injection in forms
- [ ] Try XSS attacks
- [ ] Check HTTPS enforcement

---

## Step 4.2: Bug Fixes (4 hours)

### 1. Document All Bugs
Create issues in GitHub for each bug found

### 2. Prioritize Bugs
- **Critical:** Blocks core functionality
- **High:** Major feature broken
- **Medium:** Minor feature issue
- **Low:** Cosmetic issue

### 3. Fix Critical & High Bugs
```bash
git checkout develop
git pull origin develop
git checkout -b fix/bug-description

# Make fixes
git add .
git commit -m "fix: description of fix"
git push origin fix/bug-description

# Create PR to develop
# Merge after review
```

### 4. Redeploy to Staging
After merging fixes, staging will auto-deploy

### 5. Retest Fixed Issues

---

# DAY 5: Production Deployment & Launch

## Step 5.1: Final Pre-Launch Checks (1 hour)

### Code Review
- [ ] All tests passing
- [ ] No console.log statements
- [ ] No TODO comments
- [ ] All environment variables documented
- [ ] All secrets configured

### Documentation Review
- [ ] README.md complete
- [ ] API documentation complete
- [ ] Deployment guide complete
- [ ] User guide ready

### Infrastructure Review
- [ ] Firebase production project ready
- [ ] All third-party services configured
- [ ] Domain ready (if using custom domain)
- [ ] SSL certificates ready
- [ ] Monitoring tools configured

---

## Step 5.2: Deploy to Production (30 minutes)

### 1. Create Production Branch
```bash
git checkout develop
git pull origin develop
git checkout main
git merge develop
```

### 2. Tag Release
```bash
git tag -a v1.0.0 -m "Initial production release"
git push origin main --tags
```

### 3. Monitor Deployment
- Go to GitHub → **Actions**
- Watch production deployment
- Check Netlify dashboard
- Check Vercel dashboard

### 4. Verify Production URLs
- Frontend: `https://sahijagah.com` (or Netlify URL)
- Backend: `https://api.sahijagah.com` (or Vercel URL)
- API Docs: `https://api.sahijagah.com/api-docs`

---

## Step 5.3: Post-Deployment Verification (30 minutes)

### Smoke Tests
- [ ] Homepage loads
- [ ] Login works
- [ ] Signup works
- [ ] Search works
- [ ] Property creation works
- [ ] Booking works
- [ ] Messaging works
- [ ] Admin dashboard works

### Monitor Logs
- [ ] Check Vercel logs for errors
- [ ] Check Netlify logs for errors
- [ ] Check Firebase logs
- [ ] Check Sentry for errors (if configured)

---

## Step 5.4: Launch! 🚀 (15 minutes)

### 1. Announce Launch
- [ ] Update website status
- [ ] Send launch email to beta users
- [ ] Post on social media
- [ ] Update documentation

### 2. Monitor Closely
For the first 24 hours:
- Check logs every hour
- Monitor error rates
- Monitor user signups
- Monitor performance metrics
- Be ready to rollback if needed

### 3. Collect Feedback
- Set up feedback form
- Monitor user support requests
- Track feature requests
- Note any issues

---

# Post-Launch Maintenance

## Daily Tasks (Week 1)
- [ ] Check error logs
- [ ] Monitor user activity
- [ ] Respond to support requests
- [ ] Fix critical bugs immediately

## Weekly Tasks
- [ ] Review analytics
- [ ] Update documentation
- [ ] Plan feature improvements
- [ ] Review security alerts

## Monthly Tasks
- [ ] Update dependencies
- [ ] Review and optimize costs
- [ ] Analyze user feedback
- [ ] Plan next release

---

# Rollback Procedure

If something goes wrong:

### Frontend Rollback
```bash
# Go to Netlify dashboard
# Select site → Deploys
# Find previous working deploy
# Click "Publish deploy"
```

### Backend Rollback
```bash
# Go to Vercel dashboard
# Select project → Deployments
# Find previous working deployment
# Click "..." → "Promote to Production"
```

### Git Rollback
```bash
git revert HEAD
git push origin main
```

---

# Support & Resources

## Documentation
- API Docs: `/api-docs`
- Developer Guide: `DEVELOPER_GUIDE.md`
- Architecture: `ARCHITECTURE.md`
- Deployment: `DEPLOYMENT_GUIDE.md`

## Monitoring
- Firebase Console: https://console.firebase.google.com/
- Netlify Dashboard: https://app.netlify.com/
- Vercel Dashboard: https://vercel.com/dashboard
- Sentry: https://sentry.io/ (if configured)

## Support Contacts
- Technical Issues: dev@sahijagah.com
- User Support: support@sahijagah.com
- Emergency: +91 7093187420

---

# Success Metrics to Track

## Technical KPIs
- Uptime: Target 99.9%
- Response Time: Target <500ms
- Error Rate: Target <0.1%
- Test Coverage: Target >70%

## Business KPIs
- User Registrations (by role)
- Property Listings (by city)
- Bookings (conversion rate)
- Messages (engagement)
- Active Users (DAU/MAU)

---

# 🎉 Congratulations!

You've successfully deployed Sahi Jagah to production!

**Next Steps:**
1. Monitor the platform closely
2. Gather user feedback
3. Plan feature improvements
4. Scale to more cities

**Remember:**
- Keep documentation updated
- Respond to user feedback quickly
- Monitor costs and optimize
- Plan for scale

---

**Good luck with your launch! 🚀**

*Built with ❤️ for Indian tier-2/tier-3 cities*
