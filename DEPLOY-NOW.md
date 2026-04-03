# 🚀 Quick Deploy - Scheduled Dairy

## Fastest Way to Deploy (5 Minutes)

### Option 1: Render (Recommended - Completely Free)

#### Step 1: Setup MongoDB Atlas (2 min)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create cluster (Free M0)
3. Click "Connect" → "Connect your application"
4. Copy connection string (save it!)
5. Go to "Network Access" → "Add IP" → "Allow from anywhere"

#### Step 2: Push to GitHub (1 min)
```bash
cd "C:\Full stack projects\Scheduled Dairy"
git init
git add .
git commit -m "Initial commit"
```

Create repository on GitHub: https://github.com/new

```bash
git remote add origin https://github.com/YOUR_USERNAME/scheduled-dairy.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy Backend on Render (1 min)
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect GitHub → Select "scheduled-dairy"
4. Settings:
   - **Name**: `scheduled-dairy-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build**: `npm install`
   - **Start**: `npm start`
5. Click "Advanced" → Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=anyRandomSecretKey123456
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. **Copy the URL** (like: https://scheduled-dairy-api.onrender.com)

#### Step 4: Deploy Frontend on Render (1 min)
1. Click "New +" → "Static Site"
2. Select same repository
3. Settings:
   - **Name**: `scheduled-dairy`
   - **Root Directory**: `frontend`
   - **Build**: `npm install && npm run build`
   - **Publish**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://scheduled-dairy-api.onrender.com/api
   ```
   (Use the backend URL from Step 3)
5. Click "Create Static Site"

#### ✅ Done! 
Your app is now live at: `https://scheduled-dairy.onrender.com`

---

### Option 2: Vercel (Faster, But Backend Needs Railway)

#### Backend: Deploy to Railway
1. Go to https://railway.app → Sign in with GitHub
2. "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Settings → Set Root Directory: `backend`
5. Add Environment Variables (same as above)
6. Generate Domain → Copy URL

#### Frontend: Deploy to Vercel
1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repository
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Environment Variable:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   ```
5. Deploy!

Your app is live at: `https://scheduled-dairy.vercel.app`

---

## 🎯 After Deployment

### Test Your Live App:
1. Go to your deployed URL
2. Register a new account
3. Try creating tasks, notes, uploading PDFs
4. Toggle dark mode

### Future Updates:
Just push to GitHub and it auto-deploys!
```bash
git add .
git commit -m "Updated feature"
git push origin main
```

---

## ⚠️ Important Notes

**Render Free Tier:**
- Apps sleep after 15 min inactivity
- First request takes 30-50 sec to wake up
- Solution: Upgrade to paid ($7/mo) or use Vercel for frontend

**MongoDB Atlas Free Tier:**
- 512 MB storage (enough for thousands of tasks/notes)
- Perfect for personal use

**Custom Domain:**
- Both Render and Vercel support custom domains for free
- Add in Settings → Domains

---

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check MongoDB connection string in environment variables
- Make sure Network Access allows all IPs (0.0.0.0/0)

**Frontend can't connect to backend?**
- Verify VITE_API_URL matches your backend URL
- Check backend CORS settings

**502 Error?**
- Backend is sleeping (free tier) - wait 30 seconds and refresh

---

## 📱 Share Your App

Once deployed, you can:
- Access from any device with the URL
- Share with friends/colleagues
- Use on mobile, tablet, desktop
- No need to run locally ever again!

**Your live URLs:**
- Frontend: `https://scheduled-dairy.onrender.com`
- Backend API: `https://scheduled-dairy-api.onrender.com`

---

**That's it! Your app is now accessible from anywhere! 🌍**
