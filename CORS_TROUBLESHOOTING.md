# CORS Troubleshooting Guide

## Current Setup
- **Backend**: `wedding-rsvp-production.up.railway.app`
- **Frontend**: Your Vercel app
- **Issue**: Requests from frontend not reaching backend

## Step 1: Update CORS Configuration

### In Railway Dashboard
1. Go to your Railway project
2. Add these environment variables:
   ```
   NODE_ENV=production
   FRONTEND_URL=https://your-actual-vercel-domain.vercel.app
   ```

### Update CORS Config
In `src/config/cors.config.ts`, replace:
```typescript
'https://your-frontend-domain.vercel.app'
```
with your actual Vercel domain.

## Step 2: Test Backend Endpoints

### Test Basic Health
```bash
curl https://wedding-rsvp-production.up.railway.app/api/health
```

### Test CORS Configuration
```bash
curl https://wedding-rsvp-production.up.railway.app/api/health/cors
```

### Test POST Request
```bash
curl -X POST https://wedding-rsvp-production.up.railway.app/api/health/test
```

## Step 3: Test from Frontend

### Test GET Request
```javascript
fetch('https://wedding-rsvp-production.up.railway.app/api/health')
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Test POST Request
```javascript
fetch('https://wedding-rsvp-production.up.railway.app/api/health/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

## Step 4: Check Browser Console

Look for these errors:
- `CORS policy: No 'Access-Control-Allow-Origin' header`
- `Failed to fetch`
- `Network Error`

## Step 5: Verify Environment Variables

### In Railway
1. Check `NODE_ENV` is set to `production`
2. Check `FRONTEND_URL` is set to your Vercel domain
3. Ensure `DATABASE_URL` is correct

### In Vercel
1. Check `NEXT_PUBLIC_BACKEND_URL` is set to:
   ```
   https://wedding-rsvp-production.up.railway.app
   ```

## Step 6: Common Issues & Solutions

### Issue 1: CORS Policy Error
**Solution**: Ensure your Vercel domain is in the CORS origins list

### Issue 2: Preflight Request Failing
**Solution**: Check that OPTIONS method is allowed in CORS config

### Issue 3: Credentials Not Working
**Solution**: Ensure `credentials: true` is set in CORS config

### Issue 4: Wrong Backend URL
**Solution**: Verify the backend URL in Vercel environment variables

## Step 7: Debug Steps

1. **Check Railway Logs**: Look for CORS configuration logs
2. **Check Browser Network Tab**: See if requests are being made
3. **Test with Postman**: Bypass CORS to test backend directly
4. **Check Vercel Build**: Ensure environment variables are loaded

## Step 8: Final Verification

After making changes:
1. Redeploy backend to Railway
2. Check Railway logs for CORS configuration
3. Test endpoints from browser console
4. Verify frontend can make requests

## Quick Test Commands

```bash
# Test backend health
curl https://wedding-rsvp-production.up.railway.app/api/health

# Test CORS info
curl https://wedding-rsvp-production.up.railway.app/api/health/cors

# Test with origin header
curl -H "Origin: https://your-vercel-domain.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://wedding-rsvp-production.up.railway.app/api/health/test
```

## Need Help?

If issues persist:
1. Check Railway logs for detailed CORS information
2. Verify all environment variables are set correctly
3. Test with a simple HTML file to isolate the issue
4. Check if Railway is blocking certain requests
