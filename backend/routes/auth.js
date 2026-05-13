const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
  getUsers,
  updateUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);

module.exports = router;
