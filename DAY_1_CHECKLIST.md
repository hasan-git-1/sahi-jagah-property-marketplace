# ✅ Day 1 Quick Checklist

**Print this or keep it open while you work!**

---

## Before You Start
- [ ] Create `my-credentials.txt` file on Desktop
- [ ] Have 2-3 hours available
- [ ] Have Google account ready
- [ ] Have credit card ready (for verification)

---

## Firebase (45 min)
- [ ] Go to https://console.firebase.google.com/
- [ ] Sign in with Google
- [ ] Create project: `sahi-jagah-production`
- [ ] Enable Email/Password authentication
- [ ] Enable Phone authentication
- [ ] Create Firestore database (asia-south1)
- [ ] Copy and paste security rules from `firestore.rules`
- [ ] Create 5 Firestore indexes
- [ ] Set up Firebase Storage (asia-south1)
- [ ] Copy and paste storage rules from `storage.rules`
- [ ] Set up Realtime Database (asia-southeast1)
- [ ] Set up Realtime Database rules
- [ ] Add web app, get config (7 values)
- [ ] Generate service account key (JSON file)
- [ ] Save all to `my-credentials.txt`

---

## Cloudinary (15 min)
- [ ] Go to https://cloudinary.com/users/register/free
- [ ] Sign up and verify email
- [ ] Get Cloud Name, API Key, API Secret
- [ ] Create upload preset: `sahi-jagah-properties`
- [ ] Create upload preset: `sahi-jagah-profiles`
- [ ] Save all to `my-credentials.txt`

---

## Algolia (15 min)
- [ ] Go to https://www.algolia.com/users/sign_up
- [ ] Sign up and verify email
- [ ] Create application: `sahi-jagah` (India region)
- [ ] Create index: `properties`
- [ ] Configure searchable attributes (4 items)
- [ ] Configure facets (4 items)
- [ ] Configure custom ranking (2 items)
- [ ] Get Application ID, Search Key, Admin Key
- [ ] Save all to `my-credentials.txt`

---

## SendGrid (15 min)
- [ ] Go to https://signup.sendgrid.com/
- [ ] Sign up and verify email
- [ ] Verify sender: `noreply@sahijagah.com`
- [ ] Create API key: `sahi-jagah-production`
- [ ] Copy API key (starts with SG.)
- [ ] Save all to `my-credentials.txt`

---

## Twilio (20 min) - OPTIONAL
- [ ] SKIP for now (recommended)
- [ ] OR: Go to https://www.twilio.com/try-twilio
- [ ] Sign up and verify
- [ ] Get Account SID, Auth Token, Phone Number
- [ ] Save all to `my-credentials.txt`
- [ ] Note: Need DLT registration for India (2-3 days)

---

## JWT Secrets (5 min)
- [ ] Go to https://www.random.org/strings/
- [ ] Generate 64-character string (do this TWICE)
- [ ] Save both to `my-credentials.txt` as:
  - JWT_SECRET
  - JWT_REFRESH_SECRET

---

## Final Steps
- [ ] Review `my-credentials.txt` - should have ~20 values
- [ ] Make a backup copy
- [ ] Store it securely
- [ ] DO NOT upload to GitHub
- [ ] DO NOT share with anyone

---

## ✅ Day 1 Complete!

**What you have:**
- Firebase project with database, storage, auth
- Cloudinary account with upload presets
- Algolia search index configured
- SendGrid email service
- JWT secrets generated
- All credentials saved

**Time spent:** 2-3 hours

**Next:** Day 2 - GitHub Secrets & Deployment Platforms

---

## Quick Reference

**Your credentials file should have:**
```
=== FIREBASE CONFIGURATION === (7 values)
=== FIREBASE SERVICE ACCOUNT KEY === (JSON)
=== CLOUDINARY === (3 values)
=== ALGOLIA === (3 values)
=== SENDGRID === (2 values)
=== TWILIO === (3 values or SKIPPED)
=== JWT SECRETS === (2 values)
```

**Total:** ~20 pieces of information

---

**Great job! You're ready for Day 2! 🚀**
