# Environment Variables Reference

## Backend Environment Variables

Required for backend deployment:

```env
# Node Environment
NODE_ENV=production

# Server Port
PORT=5000

# MongoDB Connection (Get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/scheduled-dairy?retryWrites=true&w=majority

# JWT Secret (Generate a random secure string)
JWT_SECRET=your_super_secure_random_jwt_secret_key_minimum_32_characters

# Frontend URL (Optional - for CORS in production)
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### How to Get MongoDB URI:
1. Go to MongoDB Atlas Dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" driver
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `scheduled-dairy`

### How to Generate JWT Secret:
Option 1: Use online generator
- https://randomkeygen.com/ (choose 256-bit WPA key)

Option 2: Use Node.js
```javascript
require('crypto').randomBytes(64).toString('hex')
```

Option 3: Use any random string (minimum 32 characters)

---

## Frontend Environment Variables

Required for frontend deployment:

```env
# Backend API URL (Your deployed backend URL)
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Important:** 
- For Render backend: `https://YOUR-APP-NAME.onrender.com/api`
- For Railway backend: `https://YOUR-APP-NAME.railway.app/api`
- Must include `/api` at the end!

---

## Platform-Specific Setup

### Render

**Backend Service:**
```
Environment Variables (in Render Dashboard):
- NODE_ENV = production
- MONGODB_URI = (your MongoDB Atlas connection string)
- JWT_SECRET = (your generated secret)
- FRONTEND_URL = (optional, your frontend URL)
```

**Frontend Static Site:**
```
Environment Variables (in Render Dashboard):
- VITE_API_URL = (your backend URL + /api)
```

### Vercel (Frontend)

Add in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL = https://your-backend-url.railway.app/api
```

### Railway (Backend)

Add in Railway Dashboard → Variables:
```
NODE_ENV = production
MONGODB_URI = (your MongoDB Atlas connection string)
JWT_SECRET = (your generated secret)
FRONTEND_URL = (your Vercel frontend URL)
```

---

## Development Environment Variables

### Backend (.env file)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scheduled-dairy
JWT_SECRET=dev_secret_key_for_local_development
NODE_ENV=development
```

### Frontend (.env.development file)
```env
VITE_API_URL=/api
```

---

## Security Best Practices

1. **Never commit .env files to Git**
   - Already in .gitignore
   - Use .env.example as template

2. **Use Strong JWT Secret**
   - Minimum 32 characters
   - Mix of letters, numbers, symbols
   - Generate randomly

3. **MongoDB Security**
   - Use strong database password
   - Enable IP whitelist (0.0.0.0/0 for cloud hosting)
   - Use latest MongoDB version

4. **HTTPS Only in Production**
   - Both Render and Vercel provide free SSL
   - Always use https:// URLs

---

## Testing Your Configuration

### Backend Health Check:
Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "message": "Scheduled Dairy API is running",
  "status": "ok"
}
```

### Frontend Check:
Visit: `https://your-frontend-url.onrender.com`

Should load the login page.

### Full Test:
1. Register a new account
2. Create a task
3. Upload a PDF
4. Create a note
5. Use the timer

If all work, your deployment is successful! 🎉

---

## Troubleshooting

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Verify MongoDB Atlas Network Access allows 0.0.0.0/0
- Check database user has read/write permissions

### "CORS Error" in frontend
- Verify VITE_API_URL in frontend environment variables
- Check backend CORS configuration includes your frontend URL
- Make sure URLs use https:// in production

### "502 Bad Gateway"
- Backend is sleeping (Render free tier)
- Wait 30-50 seconds and refresh
- Consider upgrading to paid tier ($7/month)

### "401 Unauthorized"
- Check JWT_SECRET is set in backend
- Clear browser cookies and localStorage
- Try logging out and back in

---

## Need Help?

Check the deployment guides:
- [DEPLOY-NOW.md](./DEPLOY-NOW.md) - Quick start
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed guide
- [README.md](./README.md) - Full documentation
