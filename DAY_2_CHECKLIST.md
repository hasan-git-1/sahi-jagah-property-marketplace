# 📋 DAY 2 CHECKLIST

**Goal:** Deploy your app to the internet  
**Time:** 2-3 hours

---

## ✅ STEP 1: GitHub Setup (20 min)
- [ ] 1.1 Create GitHub account (or login)
- [ ] 1.2 Create new repository `sahi-jagah-property-marketplace`
- [ ] 1.3 Upload your code to GitHub
- [ ] ✅ **Checkpoint:** Code is visible on GitHub

---

## ✅ STEP 2: Vercel Setup - Backend (30 min)
- [ ] 2.1 Create Vercel account with GitHub
- [ ] 2.2 Import your GitHub repository
- [ ] 2.3 Configure root directory as `backend`
- [ ] 2.4 Add all environment variables:
  - [ ] Firebase variables (7 values)
  - [ ] Firebase service account JSON
  - [ ] Cloudinary variables (3 values)
  - [ ] Algolia variables (3 values)
  - [ ] JWT secrets (2 values)
  - [ ] NODE_ENV and PORT
- [ ] 2.5 Deploy backend
- [ ] 2.6 Copy and save backend URL
- [ ] ✅ **Checkpoint:** Backend is live on Vercel

---

## ✅ STEP 3: Netlify Setup - Frontend (25 min)
- [ ] 3.1 Create Netlify account with GitHub
- [ ] 3.2 Import your GitHub repository
- [ ] 3.3 Configure build settings:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] 3.4 Add environment variables:
  - [ ] VITE_API_URL (your Vercel URL)
  - [ ] Firebase config (7 VITE_ variables)
  - [ ] Algolia config (2 VITE_ variables)
- [ ] 3.5 Deploy frontend
- [ ] 3.6 Copy and save website URL
- [ ] 3.7 Customize domain name (optional)
- [ ] ✅ **Checkpoint:** Website is live on Netlify

---

## ✅ STEP 4: Test Deployment (15 min)
- [ ] 4.1 Visit your website - does it load?
- [ ] 4.2 Check browser console for errors
- [ ] 4.3 Test backend API endpoint `/api/health`
- [ ] ✅ **Checkpoint:** Both frontend and backend respond

---

## ✅ STEP 5: Configure CORS & Settings (20 min)
- [ ] 5.1 Add FRONTEND_URL to Vercel environment variables
- [ ] 5.2 Redeploy backend on Vercel
- [ ] 5.3 Add your Netlify domain to Firebase authorized domains
- [ ] ✅ **Checkpoint:** Frontend and backend can communicate

---

## ✅ STEP 6: Final Testing (10 min)
- [ ] 6.1 Test user registration
- [ ] 6.2 Test property search
- [ ] 6.3 Test property listing creation
- [ ] 6.4 Check all main pages work
- [ ] ✅ **Checkpoint:** Basic functionality works

---

## 🎉 DAY 2 COMPLETE!

### Your Live App:
- **Website:** `https://your-site.netlify.app`
- **Backend:** `https://your-backend.vercel.app`
- **Status:** LIVE ON THE INTERNET! 🚀

### What's Working:
✅ Property browsing  
✅ User registration/login  
✅ Property search  
✅ Image uploads  
✅ Real-time messaging  
✅ Admin dashboard  

### Save These URLs:
Update your `my-credentials.txt` with:
- Frontend URL
- Backend URL  
- GitHub repository URL

---

**Congratulations! Your property marketplace is now live and accessible to anyone on the internet!** 🎊

**Time to celebrate! Share your website with friends and family!** 🎉