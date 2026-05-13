const express = require('express');
const router = express.Router();
const {
  getOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  validateOffer,
  toggleOffer
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/validate', validateOffer);

// Protected routes
router.get('/', protect, getOffers);
router.get('/:id', protect, getOffer);
router.post('/', protect, authorize('admin'), createOffer);
router.put('/:id', protect, authorize('admin'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);
router.patch('/:id/toggle', protect, authorize('admin'), toggleOffer);

module.exports = router;
