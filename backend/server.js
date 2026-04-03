require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration - Allow requests from deployed frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        'https://scheduled-dairy.onrender.com',
        'https://scheduled-dairy.vercel.app'
      ].filter(Boolean)
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/history', require('./routes/history'));
app.use('/api/materials', require('./routes/materials'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/profile', require('./routes/profile'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Scheduled Dairy API is running', status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
