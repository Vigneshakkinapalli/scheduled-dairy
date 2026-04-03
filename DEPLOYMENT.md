# Deployment Guide - Scheduled Dairy

This guide will help you deploy your Scheduled Dairy application to free hosting services.

## 🚀 Deployment Options

### Option 1: Render (Recommended - Free Tier Available)
- **Backend**: Deploy on Render
- **Frontend**: Deploy on Render
- **Database**: MongoDB Atlas (Free)

### Option 2: Vercel + Railway
- **Backend**: Railway (Free tier)
- **Frontend**: Vercel (Free)
- **Database**: MongoDB Atlas (Free)

---

## 📦 Prerequisites

1. Create accounts on:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free database)
   - [Render](https://render.com) (Free hosting) OR [Vercel](https://vercel.com) + [Railway](https://railway.app)
   - [GitHub](https://github.com) (To store your code)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new cluster (choose free tier M0)

2. **Configure Database**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/scheduled-dairy`)
   - Save this URL - you'll need it later

3. **Network Access**
   - Go to "Network Access" in Atlas
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

---

## 🌐 Option 1: Deploy to Render (Easiest)

### A. Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository named "scheduled-dairy"
   - Follow instructions to push your code

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/scheduled-dairy.git
   git branch -M main
   git push -u origin main
   ```

### B. Deploy Backend to Render

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**:
   - Connect your GitHub account
   - Select "scheduled-dairy" repository

3. **Configure Backend Service**:
   - **Name**: `scheduled-dairy-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=your-secure-random-jwt-secret-key-change-this
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (takes 2-3 minutes)
   - Copy the backend URL (e.g., `https://scheduled-dairy-backend.onrender.com`)

### C. Deploy Frontend to Render

1. **Create Another Web Service**:
   - Click "New +" → "Static Site"
   - Select same repository

2. **Configure Frontend Service**:
   - **Name**: `scheduled-dairy-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

3. **Add Environment Variable**:
   Create a `.env.production` file in frontend folder first:
   ```env
   VITE_API_URL=<your-backend-url-from-render>
   ```

4. **Update Frontend API Configuration**:
   - We'll need to update the API URL in the frontend

5. **Deploy**:
   - Click "Create Static Site"
   - Your app will be live at: `https://scheduled-dairy-frontend.onrender.com`

---

## 🌐 Option 2: Deploy to Vercel + Railway

### A. Deploy Backend to Railway

1. **Go to Railway**:
   - Visit https://railway.app
   - Sign in with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend**:
   - Select the project
   - Add environment variables in Settings:
     ```
     NODE_ENV=production
     MONGODB_URI=<your-mongodb-atlas-connection-string>
     JWT_SECRET=your-secure-jwt-secret
     ```

4. **Set Root Directory**:
   - In Settings → Service
   - Set Root Directory: `backend`
   - Deploy command: `npm install && npm start`

5. **Generate Domain**:
   - Go to Settings → Domains
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://scheduled-dairy-backend.railway.app`)

### B. Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variable**:
   - Add: `VITE_API_URL=<your-railway-backend-url>`

5. **Deploy**:
   - Click "Deploy"
   - Your app will be live at: `https://scheduled-dairy.vercel.app`

---

## 🔧 Update Frontend to Use Environment Variable

Update `frontend/src/utils/api.js`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at deployed URL
- [ ] Frontend is accessible at deployed URL
- [ ] MongoDB Atlas is connected
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Can create tasks, notes, upload materials
- [ ] Dark mode works
- [ ] All pages are functional

---

## 🔄 Updating Your Deployed App

### Automatic Deployment (Recommended)

Both Render and Vercel support automatic deployments:

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

2. **Automatic Deploy**:
   - Render and Vercel will automatically detect changes
   - They'll rebuild and redeploy your app
   - Wait 2-3 minutes for changes to go live

### Manual Deployment

**Render**: Click "Manual Deploy" → "Deploy latest commit"
**Vercel**: Click "Redeploy" in the deployment dashboard

---

## 🆓 Free Tier Limitations

### Render Free Tier:
- Apps sleep after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds to wake up
- 750 hours/month free

### Vercel Free Tier:
- Unlimited deployments
- 100 GB bandwidth/month
- Custom domains supported

### MongoDB Atlas Free Tier:
- 512 MB storage
- Shared RAM
- Perfect for development/small apps

### Railway Free Trial:
- $5 credit initially
- Usage-based pricing after

---

## 🎯 Alternative: Docker Deployment

If you want to deploy on your own server or VPS:

1. **Create Dockerfile for Backend** (already included)
2. **Create Dockerfile for Frontend**
3. **Use Docker Compose** for orchestration
4. **Deploy to**: DigitalOcean, AWS, Azure, or any VPS

---

## 🆘 Troubleshooting

### Backend won't connect to MongoDB:
- Check MongoDB Atlas whitelist includes 0.0.0.0/0
- Verify connection string is correct
- Check environment variables are set

### Frontend can't reach Backend:
- Verify CORS is enabled in backend
- Check VITE_API_URL environment variable
- Ensure backend URL is correct

### App keeps sleeping (Render):
- Free tier limitation
- Consider upgrading or use Vercel for frontend

### CORS Errors:
Make sure backend has CORS properly configured for your frontend domain.

---

## 💡 Pro Tips

1. **Use Environment Variables**: Never commit secrets to GitHub
2. **Enable Auto-Deploy**: Push to GitHub and changes go live automatically
3. **Monitor Logs**: Check deployment logs for errors
4. **Custom Domain**: Add your own domain in Vercel/Render settings
5. **Free SSL**: Both platforms provide free HTTPS certificates

---

**Choose your deployment method and follow the steps above!** 🚀

Once deployed, you can access your app from anywhere via the provided URL!
