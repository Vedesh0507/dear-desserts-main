const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.get('/:orderId', protect, generateInvoice);

module.exports = router;
