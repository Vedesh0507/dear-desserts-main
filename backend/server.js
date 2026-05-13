require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');
const app = require('./config/app');

// ---------- Startup Validation ----------

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
  console.warn('⚠  WARNING: JWT_SECRET is using the default insecure value.');
  console.warn('   Change it in backend/.env before deploying to production.');
}

if (!process.env.MONGODB_URI) {
  console.warn('⚠  WARNING: MONGODB_URI is not set in .env');
  console.warn('   The server will start, but database operations will fail.');
}

// ---------- Database Connection (non-blocking) ----------

connectDB();

// ---------- HTTP + Socket.io ----------

const server = http.createServer(app);

// Parse CORS origins consistently with app.js
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000'
];
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : defaultOrigins;

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
});

// Share io instance with Express app (used by req.io middleware in app.js)
app.set('io', io);

// ---------- Socket.io Events ----------

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('joinAdmin', () => {
    socket.join('admin');
    console.log('👤 Admin joined:', socket.id);
  });

  socket.on('updateOrderStatus', (data) => {
    io.emit('orderUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// ---------- Start Server ----------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🍰 Dear Desserts API Server                     ║
║                                                   ║
║   Port:        ${String(PORT).padEnd(36)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(36)}║
║   MongoDB:     ${(process.env.MONGODB_URI ? 'configured' : 'NOT SET').padEnd(36)}║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// ---------- Graceful Error Handling ----------

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message || err);
  // In production, log but don't crash for transient DB errors
  if (process.env.NODE_ENV === 'production') {
    console.error('   The server will continue running.');
  } else {
    console.error('   Shutting down in development mode.');
    server.close(() => process.exit(1));
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message || err);
  console.error(err.stack);
  server.close(() => process.exit(1));
});
