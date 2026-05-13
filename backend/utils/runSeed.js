require('dotenv').config();
const connectDB = require('../config/db');
const seedDatabase = require('./seed');

// Connect to database and seed
connectDB().then(() => {
  seedDatabase();
});
