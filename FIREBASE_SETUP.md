# Firebase Setup Guide

This guide will help you set up Firebase for the Sahi Jagah application.

## Prerequisites

- Google account
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `sahi-jagah` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Enable
   - **Phone**: Enable (requires Blaze plan for production)

### Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** for development
3. Choose a location (preferably closest to your users, e.g., `asia-south1` for India)
4. Click "Enable"

### Realtime Database

1. Go to **Realtime Database** → **Create database**
2. Start in **test mode** for development
3. Choose same location as Firestore
4. Click "Enable"

### Storage

1. Go to **Storage** → **Get started**
2. Start in **test mode** for development
3. Click "Done"

### Cloud Messaging

1. Go to **Cloud Messaging**
2. Note: This is automatically enabled

## Step 3: Get Configuration

### For Backend (Admin SDK)

1. Go to **Project Settings** (gear icon) → **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract the following values for your `.env`:
   - `FIREBASE_PROJECT_ID`: Project ID
   - `FIREBASE_PRIVATE_KEY`: Private key (entire value including `-----BEGIN PRIVATE KEY-----`)
   - `FIREBASE_CLIENT_EMAIL`: Client email

### For Frontend (Web SDK)

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register app with nickname: "Sahi Jagah Web"
5. Copy the configuration object
6. Add values to `frontend/.env`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=...
   ```

## Step 4: Deploy Security Rules

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project (if not already done)
firebase init

# Select:
# - Firestore
# - Storage
# - Emulators (optional for local development)

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

## Step 5: Set Up Firebase Emulators (Optional - for local development)

```bash
# Install emulators
firebase init emulators

# Select:
# - Authentication Emulator
# - Firestore Emulator
# - Realtime Database Emulator
# - Storage Emulator

# Start emulators
firebase emulators:start
```

The emulator UI will be available at http://localhost:4000

## Step 6: Configure Phone Authentication (Production)

For phone authentication in production:

1. Upgrade to **Blaze (Pay as you go)** plan
2. Go to **Authentication** → **Sign-in method** → **Phone**
3. Add your domain to authorized domains
4. Configure reCAPTCHA (automatically handled by Firebase)

## Step 7: Set Up Cloud Functions (Optional)

If using Firebase Functions for backend:

```bash
# Initialize functions
firebase init functions

# Select TypeScript
# Install dependencies

# Deploy functions
firebase deploy --only functions
```

## Environment Variables Summary

### Backend (.env)
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

### Frontend (.env)
```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Security Best Practices

1. **Never commit** service account keys or private keys to version control
2. Use **environment variables** for all sensitive data
3. Deploy **security rules** before going to production
4. Enable **App Check** for additional security (optional)
5. Set up **budget alerts** in Google Cloud Console
6. Regularly **audit** security rules and access logs

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Verify user is authenticated
- Ensure user has correct role

### "Project not found" errors
- Verify `FIREBASE_PROJECT_ID` is correct
- Check service account has correct permissions

### Phone authentication not working
- Ensure Blaze plan is active
- Check reCAPTCHA configuration
- Verify phone number format (+91XXXXXXXXXX for India)

## Next Steps

After Firebase setup:
1. Test authentication with emulators
2. Create test users
3. Verify Firestore read/write operations
4. Test file uploads to Storage
5. Set up Cloud Messaging for notifications

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
