const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK using service account credentials
 * from the FIREBASE_SERVICE_ACCOUNT environment variable (JSON string).
 *
 * To get this value:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key"
 * 3. Copy the JSON contents and set as env variable:
 *    FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...",...}'
 */
let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized for push notifications');
  } else {
    console.warn('⚠  FIREBASE_SERVICE_ACCOUNT not set — push notifications disabled');
    console.warn('   To enable: set FIREBASE_SERVICE_ACCOUNT in backend/.env');
  }
} catch (error) {
  console.error('❌ Firebase Admin init failed:', error.message);
}

/**
 * Send a push notification to a customer's browser via FCM.
 *
 * @param {string} fcmToken - The customer's FCM token
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} [data] - Optional data payload
 */
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  if (!firebaseInitialized || !fcmToken) return;

  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      webpush: {
        notification: {
          icon: '/logo.png',
          badge: '/logo.png',
          vibrate: [200, 100, 200],
          tag: 'dear-desserts-order',
          renotify: true,
        },
        fcmOptions: {
          link: data.orderNumber ? `/track/${data.orderNumber}` : '/',
        },
      },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
    };

    await admin.messaging().send(message);
    console.log(`✅ Push notification sent: "${title}" to token ${fcmToken.substring(0, 20)}...`);
  } catch (error) {
    // Token may have expired or been unregistered — this is normal
    if (error.code === 'messaging/registration-token-not-registered') {
      console.warn(`⚠  FCM token expired/unregistered — skipping notification`);
    } else {
      console.error('❌ Push notification failed:', error.message);
    }
  }
};

module.exports = { sendPushNotification };
