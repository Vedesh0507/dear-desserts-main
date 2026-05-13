const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueAnalytics,
  getPeakHours,
  getTopItems,
  getCustomerAnalytics,
  getCategoryAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/revenue', getRevenueAnalytics);
router.get('/peak-hours', getPeakHours);
router.get('/top-items', getTopItems);
router.get('/customers', getCustomerAnalytics);
router.get('/categories', getCategoryAnalytics);

module.exports = router;
