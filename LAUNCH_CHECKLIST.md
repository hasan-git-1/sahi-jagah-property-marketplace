# 🚀 Sahi Jagah - Quick Launch Checklist

**Use this checklist to track your progress through deployment**

---

## DAY 1: Services Setup ☐

### Firebase Setup ☐
- [ ] Create production Firebase project
- [ ] Enable Email/Password authentication
- [ ] Enable Phone authentication
- [ ] Create Firestore database (asia-south1)
- [ ] Deploy Firestore security rules
- [ ] Create Firestore indexes (5 indexes)
- [ ] Set up Firebase Storage
- [ ] Deploy Storage security rules
- [ ] Set up Realtime Database
- [ ] Enable Cloud Messaging
- [ ] Get Firebase web config
- [ ] Generate service account key

### Cloudinary Setup ☐
- [ ] Create Cloudinary account
- [ ] Get API credentials (Cloud Name, API Key, API Secret)
- [ ] Create upload preset: `sahi-jagah-properties`
- [ ] Create upload preset: `sahi-jagah-profiles`

### Algolia Setup ☐
- [ ] Create Algolia account
- [ ] Create application (India region)
- [ ] Create `properties` index
- [ ] Configure searchable attributes
- [ ] Configure faceting attributes
- [ ] Get API keys (App ID, Search Key, Admin Key)

### SendGrid Setup ☐
- [ ] Create SendGrid account
- [ ] Verify sender identity (noreply@sahijagah.com)
- [ ] Create API key
- [ ] Create email templates (optional)

### Twilio Setup ☐
- [ ] Create Twilio account
- [ ] Get India phone number (+91)
- [ ] Get API credentials (Account SID, Auth Token)
- [ ] Create messaging service
- [ ] Note: DLT registration needed for India (2-3 days)

### Document Credentials ☐
- [ ] Save all credentials in secure file
- [ ] Generate JWT secrets (2 random 64-char strings)
- [ ] DO NOT commit credentials to Git

---

## DAY 2: Deployment Platforms ☐

### GitHub Secrets ☐
- [ ] Add 8 Firebase secrets (VITE_*)
- [ ] Add 3 Netlify secrets
- [ ] Add 3 Vercel secrets
- [ ] Add 12 backend environment secrets
- [ ] Total: 26 secrets configured

### Netlify Setup ☐
- [ ] Create Netlify account
- [ ] Install Netlify CLI
- [ ] Login to Netlify
- [ ] Create staging site
- [ ] Create production site
- [ ] Get auth token
- [ ] Add secrets to GitHub
- [ ] Configure environment variables in Netlify

### Vercel Setup ☐
- [ ] Create Vercel account
- [ ] Install Vercel CLI
- [ ] Login to Vercel
- [ ] Link backend project
- [ ] Get credentials (token, org ID, project ID)
- [ ] Add secrets to GitHub
- [ ] Configure environment variables in Vercel

### Optional: Sentry ☐
- [ ] Create Sentry account
- [ ] Create project
- [ ] Get DSN
- [ ] Add to environment variables

---

## DAY 3: Staging Deployment ☐

### Code Preparation ☐
- [ ] Create develop branch
- [ ] Update frontend .env.example
- [ ] Update backend .env.example
- [ ] Install all dependencies
- [ ] Run all tests locally
- [ ] Build frontend locally
- [ ] Build backend locally

### Deploy to Staging ☐
- [ ] Push to develop branch
- [ ] Monitor GitHub Actions
- [ ] Verify Netlify staging deploy
- [ ] Verify Vercel staging deploy
- [ ] Check staging URLs work

### Seed Database ☐
- [ ] Update seed script with production Firebase
- [ ] Run seed script
- [ ] Verify data in Firebase Console
  - [ ] 4 users created
  - [ ] 5 properties created
  - [ ] Sample bookings created

### Test Staging ☐
- [ ] Test authentication (signup, login, OTP)
- [ ] Test property creation
- [ ] Test property search
- [ ] Test bookings
- [ ] Test messaging
- [ ] Test admin dashboard
- [ ] Test all test accounts work

---

## DAY 4: QA Testing ☐

### Browser Testing ☐
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Device Testing ☐
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone)
- [ ] Mobile (Android)

### Feature Testing ☐
- [ ] All authentication flows
- [ ] All property operations
- [ ] All booking operations
- [ ] All messaging operations
- [ ] All admin operations
- [ ] All notification types

### Performance Testing ☐
- [ ] Page load times (<3s)
- [ ] Image loading
- [ ] Search response time
- [ ] Real-time message delivery

### Security Testing ☐
- [ ] Protected routes require auth
- [ ] Users can't access other users' data
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] HTTPS enforcement

### Bug Fixes ☐
- [ ] Document all bugs found
- [ ] Prioritize bugs (Critical, High, Medium, Low)
- [ ] Fix critical bugs
- [ ] Fix high priority bugs
- [ ] Redeploy to staging
- [ ] Retest fixed issues

---

## DAY 5: Production Launch ☐

### Pre-Launch Checks ☐
- [ ] All tests passing
- [ ] No console.log statements
- [ ] No TODO comments
- [ ] All environment variables documented
- [ ] All secrets configured
- [ ] README.md complete
- [ ] API documentation complete
- [ ] User guide ready

### Deploy to Production ☐
- [ ] Merge develop to main
- [ ] Tag release (v1.0.0)
- [ ] Push to main with tags
- [ ] Monitor GitHub Actions
- [ ] Check Netlify production deploy
- [ ] Check Vercel production deploy
- [ ] Verify production URLs

### Post-Deployment Verification ☐
- [ ] Homepage loads
- [ ] Login works
- [ ] Signup works
- [ ] Search works
- [ ] Property creation works
- [ ] Booking works
- [ ] Messaging works
- [ ] Admin dashboard works
- [ ] Check Vercel logs
- [ ] Check Netlify logs
- [ ] Check Firebase logs
- [ ] Check Sentry (if configured)

### Launch! 🚀 ☐
- [ ] Update website status
- [ ] Send launch email to beta users
- [ ] Post on social media
- [ ] Update documentation
- [ ] Monitor logs (hourly for first 24h)
- [ ] Monitor error rates
- [ ] Monitor user signups
- [ ] Monitor performance metrics
- [ ] Set up feedback form

---

## Post-Launch (Week 1) ☐

### Daily Tasks ☐
- [ ] Check error logs
- [ ] Monitor user activity
- [ ] Respond to support requests
- [ ] Fix critical bugs immediately

### End of Week ☐
- [ ] Review analytics
- [ ] Update documentation
- [ ] Plan feature improvements
- [ ] Review security alerts

---

## Emergency Contacts

**Technical Issues:** dev@sahijagah.com  
**User Support:** support@sahijagah.com  
**Emergency:** +91 7093187420

---

## Rollback Procedure (If Needed)

### Frontend Rollback
1. Go to Netlify dashboard
2. Select site → Deploys
3. Find previous working deploy
4. Click "Publish deploy"

### Backend Rollback
1. Go to Vercel dashboard
2. Select project → Deployments
3. Find previous working deployment
4. Click "..." → "Promote to Production"

### Git Rollback
```bash
git revert HEAD
git push origin main
```

---

## Success Metrics to Track

### Technical KPIs
- [ ] Uptime: 99.9%
- [ ] Response Time: <500ms
- [ ] Error Rate: <0.1%
- [ ] Test Coverage: >70%

### Business KPIs
- [ ] User Registrations
- [ ] Property Listings
- [ ] Bookings
- [ ] Messages
- [ ] Active Users (DAU/MAU)

---

## 🎉 Launch Complete!

Once all checkboxes are checked, you've successfully launched Sahi Jagah!

**Next Steps:**
1. Monitor closely for first week
2. Gather user feedback
3. Plan feature improvements
4. Scale to more cities

---

**Good luck! 🚀**
