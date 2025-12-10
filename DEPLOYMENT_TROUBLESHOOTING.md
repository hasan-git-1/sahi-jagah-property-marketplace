# 🔧 Deployment Troubleshooting Guide

**Common issues and solutions during deployment**

---

## Firebase Issues

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Cause:** Incorrect Firebase API key in environment variables

**Solution:**
1. Go to Firebase Console → Project Settings
2. Copy the correct API key
3. Update `VITE_FIREBASE_API_KEY` in Netlify/Vercel
4. Redeploy

### Issue: "Firestore: Missing or insufficient permissions"
**Cause:** Security rules not deployed or incorrect

**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Copy content from `firestore.rules` in your project
3. Click "Publish"
4. Wait 1-2 minutes for rules to propagate

### Issue: "Firebase Storage: Unauthorized"
**Cause:** Storage rules not deployed

**Solution:**
1. Go to Firebase Console → Storage → Rules
2. Copy content from `storage.rules`
3. Click "Publish"

### Issue: "Realtime Database: Permission denied"
**Cause:** Database rules not set

**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. Set rules as per deployment guide
3. Click "Publish"

---

## Netlify Issues

### Issue: Build fails with "Module not found"
**Cause:** Missing dependencies or incorrect build command

**Solution:**
1. Check `frontend/package.json` has all dependencies
2. Verify build command in `netlify.toml`:
   ```toml
   [build]
   command = "npm run build"
   publish = "dist"
   ```
3. Clear cache and redeploy:
   ```bash
   netlify deploy --prod --clear-cache
   ```

### Issue: "Page not found" on refresh
**Cause:** SPA routing not configured

**Solution:**
1. Check `netlify.toml` has redirects:
   ```toml
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```
2. Redeploy

### Issue: Environment variables not working
**Cause:** Variables not prefixed with `VITE_`

**Solution:**
1. All frontend env vars must start with `VITE_`
2. Go to Netlify → Site settings → Environment variables
3. Ensure all variables are prefixed correctly
4. Redeploy

---

## Vercel Issues

### Issue: "Error: Cannot find module"
**Cause:** Dependencies not installed or wrong Node version

**Solution:**
1. Check `backend/package.json` has all dependencies
2. Verify Node version in `vercel.json`:
   ```json
   {
     "functions": {
       "backend/src/index.ts": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```
3. Redeploy

### Issue: "Function execution timed out"
**Cause:** Function taking too long (>10s default)

**Solution:**
1. Optimize slow functions
2. Or increase timeout in `vercel.json`:
   ```json
   {
     "functions": {
       "backend/src/index.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

### Issue: "CORS error" when calling API
**Cause:** CORS not configured for frontend domain

**Solution:**
1. Update `backend/src/index.ts`:
   ```typescript
   app.use(cors({
     origin: [
       'https://sahijagah.com',
       'https://sahi-jagah-staging.netlify.app'
     ],
     credentials: true
   }));
   ```
2. Redeploy backend

---

## GitHub Actions Issues

### Issue: Workflow fails at "Install dependencies"
**Cause:** Package-lock.json out of sync

**Solution:**
```bash
# Delete lock files
rm package-lock.json
rm backend/package-lock.json
rm frontend/package-lock.json

# Reinstall
npm install
cd backend && npm install
cd ../frontend && npm install

# Commit
git add .
git commit -m "fix: update lock files"
git push
```

### Issue: Tests fail in CI but pass locally
**Cause:** Environment differences

**Solution:**
1. Check Node version matches (18.x)
2. Ensure all test dependencies in package.json
3. Check for hardcoded paths
4. Run tests with same command as CI:
   ```bash
   npm ci
   npm test
   ```

### Issue: "Secret not found" error
**Cause:** GitHub secret not configured

**Solution:**
1. Go to GitHub → Settings → Secrets
2. Verify all 26 secrets are added
3. Check secret names match exactly (case-sensitive)
4. Re-run workflow

---

## Database Issues

### Issue: "Collection not found"
**Cause:** Database not seeded

**Solution:**
```bash
cd backend
npm run seed
```

### Issue: Seed script fails
**Cause:** Firebase credentials not set

**Solution:**
1. Create `backend/.env` file:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY=<paste entire JSON>
   ```
2. Run seed again:
   ```bash
   npm run seed
   ```

### Issue: "Index not found" error
**Cause:** Firestore indexes not created

**Solution:**
1. Go to Firebase Console → Firestore → Indexes
2. Create indexes as per deployment guide
3. Wait 5-10 minutes for indexes to build

---

## Third-Party Service Issues

### Issue: Cloudinary upload fails
**Cause:** Invalid credentials or unsigned upload

**Solution:**
1. Verify credentials in Vercel environment variables
2. Check upload preset is set to "Signed"
3. Verify API secret is correct

### Issue: Algolia search returns no results
**Cause:** Index not populated

**Solution:**
1. Check if properties are being indexed
2. Go to Algolia dashboard → Indices
3. Verify records exist
4. Check index configuration (searchable attributes)

### Issue: SendGrid emails not sending
**Cause:** Sender not verified or API key invalid

**Solution:**
1. Go to SendGrid → Sender Authentication
2. Verify sender email
3. Check API key has "Mail Send" permission
4. Verify API key in Vercel environment variables

### Issue: Twilio SMS not sending (India)
**Cause:** DLT registration not complete

**Solution:**
1. Complete DLT registration (takes 2-3 days)
2. Or use test mode for now
3. Add test phone numbers in Twilio console

---

## Performance Issues

### Issue: Slow page load times
**Cause:** Large bundle size or unoptimized images

**Solution:**
1. Check bundle size:
   ```bash
   cd frontend
   npm run build
   # Check dist/ folder size
   ```
2. Optimize images with Cloudinary
3. Enable code splitting
4. Use lazy loading for routes

### Issue: API responses slow
**Cause:** Unoptimized queries or cold starts

**Solution:**
1. Add Firestore indexes for common queries
2. Use Vercel Pro for faster cold starts
3. Implement caching with Redis
4. Optimize database queries

---

## Security Issues

### Issue: "HTTPS required" error
**Cause:** Accessing API over HTTP

**Solution:**
1. Ensure all URLs use HTTPS
2. Update `VITE_API_URL` to use HTTPS
3. Enable "Force HTTPS" in Netlify/Vercel

### Issue: CORS errors
**Cause:** Frontend domain not whitelisted

**Solution:**
1. Update CORS config in backend
2. Add frontend domain to allowed origins
3. Redeploy backend

### Issue: JWT token expired immediately
**Cause:** Server time mismatch

**Solution:**
1. Check server time is correct
2. Verify JWT expiration time (24h for access, 30d for refresh)
3. Check token generation code

---

## Common Error Messages

### "Cannot read property 'uid' of null"
**Cause:** User not authenticated

**Solution:**
1. Check auth middleware is applied to route
2. Verify JWT token is being sent in headers
3. Check token is valid and not expired

### "Document not found"
**Cause:** Trying to access non-existent document

**Solution:**
1. Check document ID is correct
2. Verify document exists in Firestore
3. Add error handling for missing documents

### "Rate limit exceeded"
**Cause:** Too many requests to API

**Solution:**
1. Check rate limiting configuration
2. Increase limits if needed
3. Implement request throttling on frontend

---

## Debugging Tips

### Check Logs

**Netlify:**
```bash
netlify logs
```

**Vercel:**
```bash
vercel logs
```

**Firebase:**
- Go to Firebase Console → Functions → Logs

### Test API Endpoints

```bash
# Test backend health
curl https://api.sahijagah.com/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.sahijagah.com/api/v1/properties
```

### Check Environment Variables

**Netlify:**
```bash
netlify env:list
```

**Vercel:**
```bash
vercel env ls
```

### Monitor Real-time

**Firebase:**
- Console → Firestore → Data
- Console → Authentication → Users
- Console → Storage → Files

**Algolia:**
- Dashboard → Indices → Browse

---

## Getting Help

### Documentation
- Firebase: https://firebase.google.com/docs
- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- Cloudinary: https://cloudinary.com/documentation
- Algolia: https://www.algolia.com/doc/
- SendGrid: https://docs.sendgrid.com
- Twilio: https://www.twilio.com/docs

### Support Channels
- GitHub Issues: Create issue in repository
- Email: dev@sahijagah.com
- Emergency: +91 7093187420

### Community
- Stack Overflow: Tag questions with service name
- Firebase Community: https://firebase.google.com/community
- Vercel Community: https://github.com/vercel/vercel/discussions

---

## Prevention Tips

### Before Deployment
1. ✅ Test everything locally first
2. ✅ Run all tests
3. ✅ Check all environment variables
4. ✅ Verify all credentials
5. ✅ Review deployment checklist

### During Deployment
1. ✅ Monitor logs in real-time
2. ✅ Test immediately after deploy
3. ✅ Have rollback plan ready
4. ✅ Keep credentials handy

### After Deployment
1. ✅ Monitor for 24 hours
2. ✅ Check error rates
3. ✅ Verify all features work
4. ✅ Collect user feedback

---

## Emergency Rollback

If something goes seriously wrong:

### Quick Rollback
```bash
# Frontend (Netlify)
netlify rollback

# Backend (Vercel)
vercel rollback

# Or use dashboards as described in LAUNCH_CHECKLIST.md
```

### Full Rollback
```bash
# Revert Git
git revert HEAD
git push origin main

# This will trigger automatic redeployment
```

---

## Still Having Issues?

1. Check this troubleshooting guide
2. Review deployment logs
3. Check Firebase Console
4. Verify all environment variables
5. Test locally with production config
6. Create GitHub issue with details
7. Contact support: dev@sahijagah.com

---

**Remember:** Most deployment issues are due to:
- Missing or incorrect environment variables
- Incorrect credentials
- Security rules not deployed
- CORS misconfiguration
- Missing dependencies

Double-check these first! 🔍
