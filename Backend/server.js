const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const userRoutes = require('./Routes/userRoutes');
const taskRoutes = require('./Routes/tasksRoutes');
const dashBoardRoutes = require('./Routes/DashboardRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');
const yourTeamRoutes = require('./Routes/yourTeamRoutes');
const yourDocumentsRoutes = require('./Routes/yourDocumentsRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const socketRoutes = require('./Routes/socketRoutes');
const uploadRoutes = require('./Routes/upLoadRoutes');
const Socket = require('socket.io');
const path = require("path");
const http = require('http');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Debug environment variables
// console.log('Environment variables loaded:');
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('PORT:', process.env.PORT);
// console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

require('./config/passportConfig');

const app = express();

// Configure CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = Socket(server, {
  cors: {
    origin: "http://localhost:5173",
    // origin: ["http://localhost:5173", "http://localhost:5000"],
    methods: ["GET", "POST"],
    credentials: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
    // allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e8,
  upgrade: false
});

app.set('io', io);

// Socket.IO middleware for authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id, 'User ID:', socket.userId);
  socketRoutes(socket, io);
});

io.on('error', (error) => {
  console.error('Socket.IO error:', error);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashBoardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/yourTeam', yourTeamRoutes);
app.use('/api/yourDocuments', yourDocumentsRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

// Handle server startup errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port or kill the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});