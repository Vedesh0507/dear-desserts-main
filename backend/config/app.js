const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { connectDB, getDBError } = require('./db');
const errorHandler = require('../middleware/errorHandler');

// Route imports
const authRoutes = require('../routes/auth');
const menuRoutes = require('../routes/menu');
const orderRoutes = require('../routes/orders');
const analyticsRoutes = require('../routes/analytics');
const offerRoutes = require('../routes/offers');
const settingsRoutes = require('../routes/settings');
const notificationRoutes = require('../routes/notifications');
const invoiceRoutes = require('../routes/invoice');

const app = express();

// ---------- Core Middleware ----------

// Parse allowed CORS origins from env (comma-separated) or use defaults
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
];
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files for uploads
app.use('/uploads', express.static(uploadsDir));

// ---------- Health Check (before DB middleware — always accessible) ----------

app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    success: true,
    message: 'Dear Desserts API is running!',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus[dbState] || 'unknown',
    databaseError: getDBError(),
    timestamp: new Date().toISOString()
  });
});

// ---------- Socket.io Middleware (set by server.js) ----------
// This allows req.io to be available in all route handlers.
// The actual io instance is attached in server.js via app.set('io', io).

app.use((req, res, next) => {
  req.io = app.get('io');
  next();
});

// ---------- Database Connection Middleware ----------
// Attempts connection on each request; returns 503 if DB is unavailable.

app.use(async (req, res, next) => {
  try {
    // If already connected, proceed immediately
    if (mongoose.connection.readyState === 1) {
      return next();
    }

    // Attempt to connect
    await connectDB();

    // Check again after attempt
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please try again later.'
      });
    }

    next();
  } catch (error) {
    console.error('Database connection middleware error:', error.message);
    res.status(503).json({
      success: false,
      message: 'Database is currently unavailable. Please try again later.'
    });
  }
});

// ---------- Emergency Admin Password Reset (Temporary) ----------
// Visit: /api/auth/force-reset-admin to reset password to Vedesh0507
app.get('/api/auth/force-reset-admin', async (req, res) => {
  try {
    const { User } = require('../models');
    const admin = await User.findOne({ email: 'admin@deardesserts.com' });
    if (admin) {
      admin.password = 'Vedesh0507';
      await admin.save();
      return res.json({ 
        success: true, 
        message: '✅ Admin password has been forced to: Vedesh0507' 
      });
    }
    res.status(404).json({ success: false, message: 'Admin user not found' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------- API Routes ----------

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/invoice', invoiceRoutes);

// ---------- Error Handler ----------

app.use(errorHandler);

module.exports = app;
