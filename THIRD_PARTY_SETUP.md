# Third-Party Services Setup Guide

This guide covers setting up all third-party services required for Sahi Jagah.

## 1. Cloudinary (Media Storage & CDN)

### Sign Up
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### Get Credentials
1. Go to Dashboard
2. Copy the following from "Account Details":
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Add to Environment Variables
```bash
# backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# frontend/.env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Create Upload Preset (for frontend direct uploads)
1. Go to Settings → Upload
2. Scroll to "Upload presets"
3. Click "Add upload preset"
4. Set:
   - **Preset name**: `sahi-jagah-unsigned`
   - **Signing Mode**: Unsigned
   - **Folder**: `sahi-jagah`
5. Save

### Free Tier Limits
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month

---

## 2. Algolia (Search)

### Sign Up
1. Go to [Algolia](https://www.algolia.com/)
2. Sign up for a free account
3. Create an application: "Sahi Jagah"

### Get Credentials
1. Go to Settings → API Keys
2. Copy:
   - **Application ID**
   - **Admin API Key** (for backend)
   - **Search-Only API Key** (for frontend)

### Add to Environment Variables
```bash
# backend/.env
ALGOLIA_APP_ID=your_app_id
ALGOLIA_ADMIN_KEY=your_admin_api_key
ALGOLIA_SEARCH_KEY=your_search_only_key
ALGOLIA_INDEX_NAME=properties

# frontend/.env
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_KEY=your_search_only_key
```

### Create Index
1. Go to Search → Indices
2. Click "Create Index"
3. Name: `properties`
4. The backend will automatically configure index settings

### Free Tier Limits
- 10,000 records
- 10,000 search requests/month
- 1 million operations/month

---

## 3. SendGrid (Email)

### Sign Up
1. Go to [SendGrid](https://sendgrid.com/)
2. Sign up for a free account
3. Complete sender verification

### Get API Key
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "Sahi Jagah Backend"
4. Permissions: Full Access
5. Copy the API key (shown only once!)

### Verify Sender Identity
1. Go to Settings → Sender Authentication
2. Choose "Single Sender Verification"
3. Add email: `noreply@sahijagah.com` (or your domain)
4. Verify the email

### Add to Environment Variables
```bash
# backend/.env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@sahijagah.com
SENDGRID_FROM_NAME=Sahi Jagah
```

### Free Tier Limits
- 100 emails/day
- Upgrade to Essentials ($19.95/month) for 50,000 emails/month

### Optional: Create Email Templates
1. Go to Email API → Dynamic Templates
2. Create templates for:
   - Welcome email
   - OTP email
   - Booking confirmation
   - Verification status
   - Lease signed

---

## 4. Twilio (SMS/OTP) - Optional

### Sign Up
1. Go to [Twilio](https://www.twilio.com/)
2. Sign up for a free trial account
3. Verify your phone number

### Get Credentials
1. Go to Console Dashboard
2. Copy:
   - **Account SID**
   - **Auth Token**

### Get Phone Number
1. Go to Phone Numbers → Manage → Buy a number
2. Choose a number with SMS capability
3. For India: Choose an Indian number or use Alphanumeric Sender ID

### Add to Environment Variables
```bash
# backend/.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Free Trial Limits
- $15.50 credit
- Can only send to verified numbers
- Upgrade for production use

### For India (Production)
- Register for Alphanumeric Sender ID
- Complete DLT (Distributed Ledger Technology) registration
- Register message templates

---

## 5. Google Maps API (Optional - for location features)

### Enable API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

### Get API Key
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → API Key
3. Restrict the key:
   - Application restrictions: HTTP referrers
   - Add your domain: `localhost:5173`, `sahijagah.netlify.app`
   - API restrictions: Select the 3 APIs above

### Add to Environment Variables
```bash
# frontend/.env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### Free Tier
- $200 credit/month
- Covers ~28,000 map loads or ~40,000 geocoding requests

---

## 6. Sentry (Error Tracking) - Optional

### Sign Up
1. Go to [Sentry](https://sentry.io/)
2. Sign up for a free account
3. Create a new project:
   - Platform: Node.js (for backend)
   - Platform: React (for frontend)

### Get DSN
1. Go to Settings → Projects → [Your Project]
2. Copy the DSN

### Add to Environment Variables
```bash
# backend/.env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# frontend/.env
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### Free Tier
- 5,000 errors/month
- 1 user
- 30-day retention

---

## Environment Variables Checklist

### Backend (.env)
```bash
# Server
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Firebase (see FIREBASE_SETUP.md)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_DATABASE_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Algolia
ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
ALGOLIA_SEARCH_KEY=
ALGOLIA_INDEX_NAME=properties

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
SENDGRID_FROM_NAME=

# Twilio (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```bash
# API
VITE_API_URL=http://localhost:3000/api/v1

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Algolia
VITE_ALGOLIA_APP_ID=
VITE_ALGOLIA_SEARCH_KEY=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=

# Support
VITE_HELPDESK_PHONE=7093187420
```

---

## Testing Configuration

After setting up all services, test each integration:

### Cloudinary
```bash
# Upload a test image
curl -X POST https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@test.jpg" \
  -F "upload_preset=YOUR_PRESET"
```

### Algolia
```bash
# Test search (use search-only key)
curl -X POST \
  "https://YOUR_APP_ID-dsn.algolia.net/1/indexes/properties/query" \
  -H "X-Algolia-API-Key: YOUR_SEARCH_KEY" \
  -H "X-Algolia-Application-Id: YOUR_APP_ID" \
  -d '{"query":"test"}'
```

### SendGrid
- Send a test email from SendGrid dashboard
- Check spam folder if not received

### Twilio
- Send a test SMS from Twilio console
- Verify it arrives at your phone

---

## Cost Estimates (Production)

### Monthly Costs (Estimated for 10,000 users)
- **Firebase**: $25-50 (Blaze plan, pay-as-you-go)
- **Cloudinary**: $0-89 (Free tier or Plus plan)
- **Algolia**: $0-1 (Free tier sufficient initially)
- **SendGrid**: $19.95 (Essentials plan)
- **Twilio**: $50-100 (depends on SMS volume)
- **Google Maps**: $0-50 (within free tier initially)
- **Sentry**: $0 (Free tier)

**Total**: ~$95-310/month

### Scaling Considerations
- Start with free tiers
- Monitor usage closely
- Upgrade services as needed
- Consider alternatives if costs increase

---

## Security Best Practices

1. **Never commit** API keys to version control
2. Use **environment variables** for all secrets
3. **Rotate keys** regularly (every 90 days)
4. Use **restricted API keys** where possible
5. Monitor **usage and billing** alerts
6. Enable **2FA** on all service accounts
7. Use **separate keys** for dev/staging/production

---

## Troubleshooting

### Cloudinary uploads failing
- Check API credentials
- Verify file size limits
- Check upload preset configuration

### Algolia search not working
- Verify index exists
- Check API key permissions
- Ensure properties are indexed

### Emails not sending
- Verify sender email
- Check spam folder
- Verify SendGrid API key
- Check daily sending limit

### SMS not sending
- Verify phone number format (+91XXXXXXXXXX)
- Check Twilio balance
- Verify number is not blocked

---

## Next Steps

1. Set up all services
2. Add credentials to `.env` files
3. Test each integration
4. Set up monitoring and alerts
5. Document any custom configurations
6. Plan for production scaling

## Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Algolia Docs](https://www.algolia.com/doc/)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Twilio Docs](https://www.twilio.com/docs)
- [Google Maps Docs](https://developers.google.com/maps/documentation)
