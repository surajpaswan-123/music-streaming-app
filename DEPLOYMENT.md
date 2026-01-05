# Vercel Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Configure Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_SERVICE_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 📋 Pre-Deployment Checklist

- ✅ Supabase project created
- ✅ Database schema applied
- ✅ Environment variables ready
- ✅ Code pushed to GitHub
- ✅ All features tested locally

## 🔧 Configuration Files

### vercel.json
The project includes a `vercel.json` that:
- Builds frontend with Vite
- Deploys backend as serverless functions
- Routes `/api/*` to backend
- Routes everything else to frontend SPA

### Frontend Build
- Uses Vite for optimized production build
- Output directory: `frontend/dist`
- SPA routing handled by rewrites

### Backend Deployment
- Deployed as Vercel serverless functions
- Entry point: `backend/src/app.js`
- Handles all `/api/*` routes

## 🌐 Environment Variables

### Frontend (.env in Vercel)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env in Vercel)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### API Not Working
- Verify environment variables are set
- Check API routes in Vercel Functions tab
- Ensure Supabase credentials are correct

### Blank Page
- Check browser console for errors
- Verify environment variables are set
- Check that build completed successfully

### 404 on Routes
- Verify `vercel.json` rewrites are correct
- Check that SPA routing is enabled
- Ensure all routes are defined in React Router

## 📊 Post-Deployment

### Verify Deployment
1. Visit your Vercel URL
2. Test authentication (signup/login)
3. Test song playback
4. Test search functionality
5. Test library features

### Monitor Performance
- Check Vercel Analytics
- Monitor API response times
- Check error logs in Vercel dashboard

### Custom Domain (Optional)
1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records
4. Wait for SSL certificate

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- Push to `main` → Production deployment
- Push to other branches → Preview deployment

## 📝 Important Notes

1. **Environment Variables**: Must be set in Vercel dashboard
2. **API Routes**: All backend routes must start with `/api`
3. **CORS**: Handled automatically by Vercel
4. **Serverless Functions**: Backend runs as serverless functions
5. **Build Time**: First build may take 2-3 minutes

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Homepage loads with songs
- ✅ Search works
- ✅ Authentication works
- ✅ Player plays songs
- ✅ Library features work
- ✅ No console errors

## 🆘 Need Help?

- Check Vercel deployment logs
- Review browser console errors
- Verify Supabase connection
- Check environment variables
- Review API endpoint responses

---

**Your app should now be live on Vercel!** 🎉

Visit your deployment URL and enjoy your music streaming app!
