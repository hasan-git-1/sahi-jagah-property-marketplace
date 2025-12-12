# 🔍 Signup Debug Guide - Fix Your Authentication Issues

**Current Issue:** Signup is failing on your deployed application

## 🎯 Quick Diagnosis

Based on your Netlify environment variables, I can see potential issues:

### 1. **API URL Configuration Issue**
Your Netlify has: `VITE_API_URL = https://sahijagahproperty.vercel.app/api/v1`

**Problem:** This might be pointing to the wrong backend or the backend might not be properly deployed.

### 2. **Environment Variable Mismatch**
Your Netlify and Vercel have different configurations which could cause authentication failures.

---

## 🚨 Immediate Fixes

### Step 1: Test Your Backend API

Open this URL in your browser:
```
https://sahijagahproperty.vercel.app/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-11T..."
}
```

**If you get an error or no response:**
- Your backend is not deployed properly
- The URL is incorrect

### Step 2: Test Signup Endpoint Directly

Use this test in your browser console (F12):

```javascript
fetch('https://sahijagahproperty.vercel.app/api/v1/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123',
    role: 'client'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### Step 3: Check Network Tab

1. Open your deployed site: `https://sahijagah.netlify.app`
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to signup
5. Look for the API call to `/auth/signup`
6. Check the response

---

## 🔧 Common Issues & Solutions

### Issue 1: CORS Error
**Symptoms:** 
- "Access to fetch blocked by CORS policy"
- Network request fails

**Solution:**
Your backend needs to allow your frontend domain. Check if your backend CORS is configured for:
- `https://sahijagah.netlify.app`
- `https://your-actual-netlify-domain.netlify.app`

### Issue 2: 404 Not Found
**Symptoms:**
- API returns 404
- "Cannot GET /api/v1/auth/signup"

**Solution:**
- Backend not deployed properly
- Routes not configured correctly
- Wrong API URL

### Issue 3: 500 Internal Server Error
**Symptoms:**
- Server error response
- Database connection issues

**Solution:**
- Check Vercel function logs
- Verify Firebase credentials
- Check environment variables in Vercel

### Issue 4: Firebase Authentication Error
**Symptoms:**
- "Firebase: Error (auth/invalid-api-key)"
- Authentication fails

**Solution:**
Check these environment variables in Netlify:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

---

## 🛠️ Step-by-Step Debug Process

### Step 1: Verify Backend Deployment

```bash
# Test basic health
curl https://sahijagahproperty.vercel.app/health

# Test API health
curl https://sahijagahproperty.vercel.app/api/v1/health

# Test signup endpoint
curl -X POST https://sahijagahproperty.vercel.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "testpassword123",
    "role": "client"
  }'
```

### Step 2: Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Find your `sahijagahproperty` project
3. Go to Functions tab
4. Check recent invocations and errors

### Step 3: Verify Environment Variables

**In Vercel (Backend):**
- `FIREBASE_SERVICE_ACCOUNT_KEY`
- `FIREBASE_DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_*` variables
- `ALGOLIA_*` variables

**In Netlify (Frontend):**
- `VITE_API_URL` (should point to your Vercel backend)
- `VITE_FIREBASE_*` variables
- All should start with `VITE_`

### Step 4: Test Frontend Locally with Production API

```bash
cd frontend

# Create .env.local file
echo "VITE_API_URL=https://sahijagahproperty.vercel.app/api/v1" > .env.local

# Add your Firebase config
echo "VITE_FIREBASE_API_KEY=your_key_here" >> .env.local
# ... add other Firebase vars

# Test locally
npm run dev
```

Try signup locally - if it works, the issue is with your deployed frontend config.

---

## 🎯 Most Likely Fixes

### Fix 1: Update API URL in Netlify

1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Update `VITE_API_URL` to: `https://sahijagahproperty.vercel.app/api/v1`
4. Redeploy

### Fix 2: Check Firebase Configuration

Verify these match your Firebase project:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123
```

### Fix 3: Enable CORS in Backend

Make sure your backend allows your frontend domain:

```typescript
// In backend/src/index.ts
app.use(cors({
  origin: [
    'https://sahijagah.netlify.app',
    'https://your-actual-domain.netlify.app',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

---

## 🚀 Quick Test Commands

### Test 1: Backend Health
```bash
curl https://sahijagahproperty.vercel.app/api/v1/health
```

### Test 2: Signup API
```bash
curl -X POST https://sahijagahproperty.vercel.app/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","role":"client"}'
```

### Test 3: Frontend API Call
Open browser console on your deployed site and run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

---

## 📋 Checklist

- [ ] Backend health endpoint responds
- [ ] Signup API endpoint responds (test with curl)
- [ ] VITE_API_URL points to correct backend
- [ ] All Firebase environment variables are correct
- [ ] CORS allows your frontend domain
- [ ] Vercel function logs show no errors
- [ ] Network tab shows successful API calls

---

## 🆘 If Still Not Working

### Get Detailed Error Information

1. **Check Browser Console:**
   - Open F12 → Console tab
   - Try signup
   - Copy any error messages

2. **Check Network Tab:**
   - F12 → Network tab
   - Try signup
   - Find the failed request
   - Check Response tab for error details

3. **Check Vercel Logs:**
   - Go to Vercel dashboard
   - Functions → View logs
   - Look for errors during signup attempts

### Contact Information

If you're still stuck, provide these details:
1. Error message from browser console
2. Network request/response details
3. Vercel function logs
4. Your current environment variables (without sensitive values)

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Backend health check returns 200 OK
- ✅ Signup API returns user data and tokens
- ✅ Frontend shows "Account created successfully"
- ✅ User appears in Firebase Authentication
- ✅ User data saved in Firestore

---

**Next Steps:** Once signup is working, test login, then other features like property listing, search, etc.