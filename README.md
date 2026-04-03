# 📅 Scheduled Dairy - Full Stack MERN Application

A comprehensive task management and productivity application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Organize your daily tasks, store study materials, take notes, and track your time - all in one place!

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/scheduled-dairy)

## 🌐 Live Demo

Want to use the app right away? Deploy it in 5 minutes! See [DEPLOY-NOW.md](./DEPLOY-NOW.md)

## ✨ Features

### 🗓️ Daily Task Scheduler
- Create and manage daily task sheets with to-do lists
- Set start and end times for each task
- Mark tasks as complete with checkboxes
- Visual progress bar showing daily completion percentage
- Add, edit, delete, and reorder tasks
- Tasks sorted by time range

### 🕘 History
- Automatically store completed daily sheets
- View past task sheets with date and completion stats
- Search and filter by date or keyword
- Restore old sheets to reuse or modify
- View detailed task breakdown for each day

### 📚 Materials / Blog
- Upload and organize PDF study materials
- Add title, subject, and description for each upload
- File preview and download options
- Filter by subject, category, or semester
- Supported categories: Notes, Books, Papers, Assignments

### 📝 Notes (Notion-like)
- Rich text editor with formatting options
- Create multiple note pages with titles
- Support for headings, bullet points, checklists, code blocks
- Tag system for organization
- Favorite notes for quick access
- Auto-save functionality
- Full CRUD operations

### ⏱️ Timer
- **Stopwatch**: Start, pause, and reset functionality
- **Countdown Timer**: Set custom duration with alert on completion
- Preset quick-set buttons (5, 15, 25, 45 minutes, 1 hour)
- Motivational quotes for productivity
- Productivity tips and techniques

### 🔐 Authentication
- JWT-based secure login and signup
- Protected routes and API endpoints
- User session management

### 🎨 UI/UX Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Seamless experience on mobile and desktop
- **Modern UI**: Built with Tailwind CSS
- **Toast Notifications**: Real-time feedback for actions
- **Loading States**: Smooth user experience

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **React Quill** - Rich text editor
- **React Icons** - Icon library
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **date-fns** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **express-validator** - Input validation

## � Quick Deploy (Recommended)

**Want to access your app from anywhere without running it locally?**

See our deployment guides:
- **[DEPLOY-NOW.md](./DEPLOY-NOW.md)** - 5-minute quick start
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide

### Free Hosting Options:
- ✅ **Render** - Deploy both frontend & backend (Free tier)
- ✅ **Vercel + Railway** - Fast deployment (Free tier)
- ✅ **MongoDB Atlas** - Free database hosting

**After deployment, access your app from any device via URL! No local setup needed.**

---

## �📦 Local Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd "Scheduled Dairy"
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/scheduled-dairy
# JWT_SECRET=your_secure_jwt_secret_key
# NODE_ENV=development
\`\`\`

### 3. Frontend Setup

\`\`\`bash
cd ../frontend

# Install dependencies
npm install
\`\`\`

### 4. Start MongoDB

Make sure MongoDB is running on your system:

\`\`\`bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
\`\`\`

### 5. Run the Application

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

\`\`\`
Scheduled Dairy/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── upload.js             # Multer file upload
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Task.js               # Task schema
│   │   ├── DailySheet.js         # History schema
│   │   ├── Material.js           # Materials schema
│   │   └── Note.js               # Notes schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── tasks.js              # Task endpoints
│   │   ├── history.js            # History endpoints
│   │   ├── materials.js          # Materials endpoints
│   │   └── notes.js              # Notes endpoints
│   ├── uploads/                  # PDF storage
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx        # App layout
    │   │   ├── Navbar.jsx        # Navigation bar
    │   │   └── Sidebar.jsx       # Side navigation
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Auth state management
    │   │   └── ThemeContext.jsx  # Theme management
    │   ├── pages/
    │   │   ├── Login.jsx         # Login page
    │   │   ├── Register.jsx      # Register page
    │   │   ├── Dashboard.jsx     # Dashboard
    │   │   ├── TaskScheduler.jsx # Task scheduler
    │   │   ├── History.jsx       # History page
    │   │   ├── Materials.jsx     # Materials page
    │   │   ├── Notes.jsx         # Notes page
    │   │   └── Timer.jsx         # Timer page
    │   ├── utils/
    │   │   └── api.js            # Axios configuration
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
\`\`\`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get tasks for a date
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/bulk/reorder` - Reorder tasks
- `DELETE /api/tasks/:id` - Delete task

### History
- `GET /api/history` - Get all daily sheets
- `GET /api/history/:id` - Get single sheet
- `POST /api/history` - Save current day as sheet
- `POST /api/history/:id/restore` - Restore sheet
- `DELETE /api/history/:id` - Delete sheet

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials/subjects` - Get unique subjects
- `GET /api/materials/:id` - Get single material
- `POST /api/materials` - Upload new material
- `PUT /api/materials/:id` - Update material
- `GET /api/materials/:id/download` - Download file
- `DELETE /api/materials/:id` - Delete material

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/tags` - Get unique tags
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `PATCH /api/notes/:id/favorite` - Toggle favorite
- `DELETE /api/notes/:id` - Delete note

## 🎯 Usage Guide

### Getting Started
1. **Register** a new account or **Login** with existing credentials
2. You'll be redirected to the **Dashboard** showing your stats

### Daily Task Management
1. Go to **Task Scheduler**
2. Select a date (defaults to today)
3. Click **Add Task** to create a new task
4. Fill in title, description, start time, and end time
5. Mark tasks as complete by clicking the checkbox
6. Edit or delete tasks using the action buttons
7. Click **Save to History** to store your daily sheet

### Viewing History
1. Go to **History** page
2. Use filters to search by date or keyword
3. Click **View** to see detailed task breakdown
4. Click **Restore** to copy tasks to today's schedule
5. Click **Delete** to remove a daily sheet

### Managing Materials
1. Go to **Materials** page
2. Click **Upload Material**
3. Select a PDF file and fill in details
4. Use filters to find materials by subject or category
5. Click **Download** to get the PDF
6. Edit metadata or delete materials as needed

### Taking Notes
1. Go to **Notes** page
2. Click **New Note** to create a note
3. Add a title and use the rich text editor
4. Add tags for organization
5. Click **Favorite** to mark important notes
6. Notes are saved when you click **Save Note**
7. Use search and filters to find notes quickly

### Using Timer
1. Go to **Timer** page
2. **Stopwatch**: Click Start/Pause/Reset
3. **Countdown**: 
   - Use quick-set buttons or enter custom time
   - Click Start Countdown
   - Get an audio alert when time is up

### Dark Mode
- Click the sun/moon icon in the navbar to toggle dark mode
- Your preference is saved automatically

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation with express-validator
- File type validation for uploads
- CORS enabled for security

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB service is active

### Port Already in Use
- Change PORT in backend .env file
- Update vite.config.js proxy if needed

### File Upload Issues
- Check uploads/ directory exists in backend
- Verify file size limits in upload.js
- Ensure only PDF files for materials

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created with ❤️ for productivity enthusiasts

## 🙏 Acknowledgments

- React Icons for the beautiful icons
- Tailwind CSS for the styling framework
- React Quill for the rich text editor
- All open-source contributors

---

**Happy Organizing! 📅✨**
