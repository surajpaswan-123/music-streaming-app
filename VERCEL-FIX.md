# 🚀 Quick Fix for Vercel Deployment

## Problem
UI not showing on Vercel deployment.

## Solution Applied

### 1. Fixed API Configuration
- Updated `frontend/src/services/api.js` to use relative paths (`/api`)
- This allows the frontend to connect to backend on Vercel

### 2. Updated Vercel Configuration
- Created proper `vercel.json` with:
  - Frontend build configuration
  - Backend serverless function setup
  - Proper routing for SPA and API

### 3. Added Build Script
- Added `vercel-build` script to `frontend/package.json`

## 🔧 What You Need to Do

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

**For Frontend:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**For Backend:**
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### Step 2: Redeploy

After setting environment variables:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger auto-deployment

## 📋 Files Changed

1. ✅ `vercel.json` - Proper routing configuration
2. ✅ `frontend/vite.config.js` - Build configuration
3. ✅ `frontend/package.json` - Added vercel-build script
4. ✅ `frontend/src/services/api.js` - Fixed API base URL
5. ✅ `DEPLOYMENT.md` - Complete deployment guide

## 🎯 Expected Result

After redeployment with environment variables:
- ✅ Homepage loads with UI
- ✅ Songs display correctly
- ✅ Search works
- ✅ Authentication works
- ✅ Player functions properly

## 🔍 If Still Not Working

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Verify Environment Variables**
   - Go to Vercel → Settings → Environment Variables
   - Ensure all 4 variables are set
   - Check for typos in variable names

3. **Check Build Logs**
   - Go to Vercel → Deployments
   - Click on latest deployment
   - Check build logs for errors

4. **Verify Supabase**
   - Ensure Supabase project is active
   - Check that API keys are correct
   - Verify database schema is applied

## 📞 Quick Debug Commands

```bash
# Check if API is responding
curl https://your-app.vercel.app/api/health

# Check if frontend is built
curl https://your-app.vercel.app/

# View deployment logs
vercel logs your-deployment-url
```

## ✅ Checklist

Before redeploying, ensure:
- [ ] All environment variables are set in Vercel
- [ ] Supabase project is active
- [ ] Database schema is applied
- [ ] Latest code is pushed to GitHub
- [ ] No build errors locally

---

**The fixes are committed. Now set environment variables and redeploy!** 🚀
