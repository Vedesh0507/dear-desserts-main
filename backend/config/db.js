const mongoose = require('mongoose');

let isConnected = false;
let connectionAttempt = null;
let lastError = null;

const connectDB = async () => {
  // If already connected, reuse connection
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, wait for it
  if (connectionAttempt) {
    return connectionAttempt;
  }

  if (!process.env.MONGODB_URI) {
    console.error('⚠  MONGODB_URI environment variable is not set.');
    console.error('   Set it in backend/.env to connect to your database.');
    return; // Don't throw — let the server start without DB
  }

  // Mask URI for logging
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/.*@/, '//****:****@');
  console.log(`🔌 Attempting to connect to MongoDB: ${maskedUri}`);

  try {
    // Start connection attempt
    connectionAttempt = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await connectionAttempt;
    isConnected = true;
    connectionAttempt = null;
    lastError = null;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    connectionAttempt = null;
    isConnected = false;
    lastError = error.message;
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error('   The server will continue running. API routes requiring the database will return 503.');
  }
};

const getDBError = () => lastError;

// Listen for disconnection events to update state
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB reconnected.');
});

module.exports = { connectDB, getDBError };
