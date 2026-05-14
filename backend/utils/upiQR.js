const QRCode = require('qrcode');

/**
 * Build a UPI payment intent URL.
 *
 * Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=INR&tn=<NOTE>
 *
 * This works with PhonePe, Google Pay, Paytm, BHIM, and all UPI apps.
 *
 * @param {Object} options
 * @param {number} options.amount      — exact payment amount (e.g. 250)
 * @param {string} options.orderId     — order number for reference (e.g. DD202605130001)
 * @param {number} options.tokenNumber — token number for display
 * @param {string} [options.upiId]     — payee UPI ID (defaults to env)
 * @param {string} [options.payeeName] — payee display name (defaults to env)
 * @returns {string} UPI intent URL
 */
function buildUPIIntentURL({ amount, orderId, tokenNumber, upiId, payeeName }) {
  const pa = upiId || process.env.UPI_ID;
  const pn = payeeName || process.env.UPI_PAYEE_NAME || 'Dear Desserts';

  if (!pa || pa.trim() === '') {
    throw new Error('UPI_ID is not configured in .env. Current value: ' + pa);
  }

  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided for QR generation: ' + amount);
  }

  // Use fallback if orderId or tokenNumber are missing (though they shouldn't be)
  const displayToken = tokenNumber || '00';
  const displayOrder = orderId || 'NEW';

  const transactionNote = `Token ${displayToken} - Order ${displayOrder}`;

  const params = new URLSearchParams({
    pa,
    pn,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: transactionNote,
  });

  return `upi://pay?${params.toString()}`;
}

/**
 * Generate a QR code as a base64 data URL from a UPI intent.
 *
 * @param {Object} options — same as buildUPIIntentURL
 * @returns {Promise<Object>} { upiURL, qrDataURL }
 */
async function generatePaymentQR(options) {
  const upiURL = buildUPIIntentURL(options);

  const qrDataURL = await QRCode.toDataURL(upiURL, {
    errorCorrectionLevel: 'M',
    width: 400,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return {
    upiURL,
    qrDataURL,
    amount: options.amount,
    payeeName: options.payeeName || process.env.UPI_PAYEE_NAME || 'Dear Desserts',
    payeeUPI: options.upiId || process.env.UPI_ID,
  };
}

module.exports = { buildUPIIntentURL, generatePaymentQR };
