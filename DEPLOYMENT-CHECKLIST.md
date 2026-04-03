# 📋 Deployment Checklist

Use this checklist to ensure successful deployment of your Scheduled Dairy app.

---

## ☁️ Pre-Deployment Setup

### MongoDB Atlas (Database)
- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user with password
- [ ] Saved database password securely
- [ ] Configured Network Access (0.0.0.0/0)
- [ ] Copied connection string
- [ ] Tested connection locally (optional)

### GitHub Repository
- [ ] Created GitHub account
- [ ] Created new repository named "scheduled-dairy"
- [ ] Repository is public (or has deployment permissions)
- [ ] Initialized git in local project (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Made first commit (`git commit -m "Initial commit"`)
- [ ] Pushed to GitHub (`git push origin main`)

### Environment Variables Prepared
- [ ] Have MongoDB connection string
- [ ] Generated JWT secret (32+ characters)
- [ ] Noted which hosting platform to use
- [ ] Ready to input backend URL to frontend

---

## 🎯 Render Deployment (Recommended)

### Backend Service
- [ ] Logged into Render dashboard
- [ ] Clicked "New +" → "Web Service"
- [ ] Connected GitHub account
- [ ] Selected "scheduled-dairy" repository
- [ ] Configured settings:
  - [ ] Name: `scheduled-dairy-api`
  - [ ] Root Directory: `backend`
  - [ ] Environment: `Node`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Plan: Free
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<your-connection-string>`
  - [ ] `JWT_SECRET=<your-secret>`
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment (2-3 minutes)
- [ ] Copied backend URL (e.g., https://scheduled-dairy-api.onrender.com)
- [ ] Tested health endpoint: `https://YOUR-URL.onrender.com/api/health`

### Frontend Static Site
- [ ] Clicked "New +" → "Static Site"
- [ ] Selected same repository
- [ ] Configured settings:
  - [ ] Name: `scheduled-dairy`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Publish Directory: `dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL=<your-backend-url>/api`
- [ ] Clicked "Create Static Site"
- [ ] Waited for deployment (2-3 minutes)
- [ ] Copied frontend URL

---

## 🚀 Vercel + Railway Deployment (Alternative)

### Railway Backend
- [ ] Logged into Railway
- [ ] Created new project from GitHub
- [ ] Selected repository
- [ ] Set root directory to `backend`
- [ ] Added environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=<your-connection-string>`
  - [ ] `JWT_SECRET=<your-secret>`
- [ ] Generated domain
- [ ] Copied backend URL

### Vercel Frontend
- [ ] Logged into Vercel
- [ ] Clicked "Add New Project"
- [ ] Imported GitHub repository
- [ ] Configured settings:
  - [ ] Root Directory: `frontend`
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Added environment variable:
  - [ ] `VITE_API_URL=<railway-backend-url>/api`
- [ ] Deployed
- [ ] Copied frontend URL

---

## ✅ Post-Deployment Testing

### Basic Tests
- [ ] Frontend loads without errors
- [ ] Can access login page
- [ ] Can register a new account
- [ ] Registration successful
- [ ] Can login with new account
- [ ] Dashboard loads with stats
- [ ] Dark mode toggle works

### Feature Tests
- [ ] **Task Scheduler**:
  - [ ] Can create new task
  - [ ] Can mark task as complete
  - [ ] Progress bar updates
  - [ ] Can edit task
  - [ ] Can delete task
  - [ ] Can save to history

- [ ] **History**:
  - [ ] Saved sheets appear
  - [ ] Can view sheet details
  - [ ] Can restore sheet
  - [ ] Search works
  - [ ] Date filter works

- [ ] **Materials**:
  - [ ] Can upload PDF
  - [ ] PDF appears in list
  - [ ] Can download PDF
  - [ ] Can edit metadata
  - [ ] Can delete material
  - [ ] Filter by subject works

- [ ] **Notes**:
  - [ ] Can create new note
  - [ ] Rich text editor works
  - [ ] Can add tags
  - [ ] Can mark as favorite
  - [ ] Can save note
  - [ ] Search works
  - [ ] Can delete note

- [ ] **Timer**:
  - [ ] Stopwatch starts/pauses/resets
  - [ ] Countdown timer accepts input
  - [ ] Countdown timer counts down
  - [ ] Alert plays on completion
  - [ ] Preset buttons work

### Mobile Testing
- [ ] Tested on mobile browser
- [ ] Sidebar menu works
- [ ] All pages responsive
- [ ] Can perform all actions
- [ ] Dark mode works on mobile

---

## 🔒 Security Verification

- [ ] HTTPS enabled (padlock in browser)
- [ ] JWT_SECRET is secure (32+ random characters)
- [ ] MongoDB password is strong
- [ ] .env files not committed to GitHub
- [ ] No sensitive data in frontend code
- [ ] CORS configured correctly
- [ ] API endpoints require authentication

---

## 📱 Sharing & Access

- [ ] Bookmarked frontend URL
- [ ] Tested on different devices
- [ ] Shared URL with team/friends (optional)
- [ ] Added app to mobile home screen (optional)
- [ ] Configured custom domain (optional)

---

## 🔄 Auto-Deployment Verification

- [ ] Made a small change in code
- [ ] Committed and pushed to GitHub
- [ ] Deployment triggered automatically
- [ ] Changes appeared on live site
- [ ] Verified deployment logs

---

## 📊 Monitoring Setup

- [ ] Checked deployment logs
- [ ] Set up uptime monitoring (optional)
- [ ] Noted free tier limitations
- [ ] Understood wake-up time for Render
- [ ] Reviewed usage/bandwidth limits

---

## 🎉 Final Checklist

- [ ] App is live and accessible
- [ ] All features working correctly
- [ ] Mobile responsive
- [ ] Dark mode functional
- [ ] Can create account and login
- [ ] Data persists across sessions
- [ ] Auto-deployment working
- [ ] URLs bookmarked
- [ ] Deployment documented

---

## 📝 Important URLs to Save

Fill these in after deployment:

```
Frontend URL: _________________________________
Backend URL: _________________________________
MongoDB Atlas URL: _________________________________
GitHub Repository: _________________________________
```

---

## 🆘 Troubleshooting Checks

If something doesn't work:

### Backend Issues
- [ ] Check Render/Railway logs for errors
- [ ] Verify MongoDB connection string
- [ ] Check all environment variables set
- [ ] Test `/api/health` endpoint

### Frontend Issues
- [ ] Check browser console for errors
- [ ] Verify `VITE_API_URL` is correct
- [ ] Clear browser cache
- [ ] Check network tab for API calls

### Connection Issues
- [ ] Backend and frontend URLs match
- [ ] CORS configured for frontend domain
- [ ] MongoDB Network Access allows all IPs
- [ ] No typos in environment variables

---

## ✨ Optimization (Optional)

- [ ] Add custom domain
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CDN for faster loading
- [ ] Add analytics (Google Analytics)
- [ ] Set up automated backups
- [ ] Upgrade to paid tier (no sleeping)

---

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ App accessible via URL from any device
- ✅ All 5 main pages functional
- ✅ Can create, read, update, delete data
- ✅ Changes auto-deploy on git push
- ✅ Mobile responsive
- ✅ Dark mode works
- ✅ No console errors

---

**Congratulations! Your Scheduled Dairy app is now live! 🎊**

Save this checklist for future deployments or troubleshooting.
