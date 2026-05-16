const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  getUsers,
  updateUser,
  resetUserPassword,
  deleteUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.post('/login', login);

// First-admin bootstrap OR authenticated admin creating users
router.post('/register', register);

// Authenticated user
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

// Admin-only user management
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.put('/users/:id/reset-password', protect, authorize('admin'), resetUserPassword);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
