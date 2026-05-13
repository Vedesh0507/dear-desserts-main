const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByStatus,
  getOrderQueue,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  getPaymentQR,
  trackOrder,
  deleteOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', createOrder);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id/payment-qr', getPaymentQR);

// Protected routes
router.get('/', protect, getOrders);
router.get('/kanban', protect, getOrdersByStatus);
router.get('/queue', protect, getOrderQueue);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, updateOrderStatus);
router.patch('/:id/payment', protect, updatePaymentStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;


