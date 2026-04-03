# 🚀 Quick Start Guide

## Step-by-Step Setup

### 1️⃣ Install MongoDB
If you don't have MongoDB installed:

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Check if MongoDB is running:**
```powershell
mongod --version
```

### 2️⃣ Setup Backend

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env file with a text editor and add:
# JWT_SECRET=mySecretKey123ChangeThisInProduction
```

### 3️⃣ Setup Frontend

```powershell
# Navigate to frontend folder (from root)
cd ..\frontend

# Install dependencies
npm install
```

### 4️⃣ Start the Application

Open TWO PowerShell terminals:

**Terminal 1 - Start Backend:**
```powershell
cd backend
npm run dev
```
✅ You should see: "Server is running on port 5000" and "MongoDB Connected"

**Terminal 2 - Start Frontend:**
```powershell
cd frontend
npm run dev
```
✅ You should see: "Local: http://localhost:3000"

### 5️⃣ Access the Application

Open your browser and go to: **http://localhost:3000**

### 6️⃣ First Time Use

1. Click **Sign up now** on the login page
2. Create your account with:
   - Name: Your Name
   - Email: your@email.com
   - Password: at least 6 characters
3. You'll be automatically logged in to the Dashboard!

## 🎯 Quick Test

1. **Dashboard** - View your stats overview
2. **Task Scheduler** - Add a task for today
3. **History** - Save and view your task sheets
4. **Materials** - Upload a PDF study material
5. **Notes** - Create a new note with formatting
6. **Timer** - Try the stopwatch or countdown timer
7. **Dark Mode** - Toggle the theme using the sun/moon icon

## 📱 Features Quick Access

| Feature | Description |
|---------|-------------|
| 🗓️ Task Scheduler | Plan your daily tasks with time slots |
| 🕘 History | Review past daily sheets |
| 📚 Materials | Upload and manage PDF files |
| 📝 Notes | Rich text notes like Notion |
| ⏱️ Timer | Stopwatch & countdown timer |
| 🌙 Dark Mode | Eye-friendly dark theme |

## ⚠️ Troubleshooting

**MongoDB not connecting?**
```powershell
# Start MongoDB service (Windows)
net start MongoDB

# Or check if mongod is running
mongod
```

**Port 3000 already in use?**
- Close other applications using port 3000
- Or edit `vite.config.js` to use a different port

**Port 5000 already in use?**
- Edit `backend/.env` and change PORT=5000 to PORT=5001
- Also update `frontend/vite.config.js` proxy target

**Dependencies not installing?**
```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

## 📚 Next Steps

- Explore all 5 main pages
- Test creating, editing, and deleting items
- Try uploading a PDF in Materials
- Create formatted notes with headings and lists
- Use the Timer for productivity sessions
- Check out the dark mode toggle

## 🆘 Need Help?

Check the main README.md for:
- Complete API documentation
- Project structure details
- Advanced configuration options
- Security features
- Contributing guidelines

---

**Enjoy your organized, productive day! 📅✨**
