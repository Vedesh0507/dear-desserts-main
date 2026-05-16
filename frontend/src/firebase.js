import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAzDF6-7KyI79y-zlyH0POV8ZYcRv8tlCw",
  authDomain: "dear-desserts-notifications.firebaseapp.com",
  projectId: "dear-desserts-notifications",
  storageBucket: "dear-desserts-notifications.firebasestorage.app",
  messagingSenderId: "1033996360716",
  appId: "1:1033996360716:web:501a3b348de16a1b1ce229",
  measurementId: "G-9BZRGQTFN7"
};

const VAPID_KEY = 'BKFRvxTBIG5HqvxOpAkLeGsvx7tDvthvFL9WSc0VS9xS8JHS9Cj7Ve8A5GxrTf-brc1jXLdF5DRKSSg9Jq3k7RU';

const app = initializeApp(firebaseConfig);
let messaging = null;

// Initialize messaging only if supported (not in SSR, not in unsupported browsers)
const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
    }
  } catch (err) {
    console.error('Firebase Messaging not supported:', err);
  }
};

initMessaging();

/**
 * Request notification permission and return FCM token.
 * Returns null if permission denied or messaging not supported.
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) return null;

    // Ensure messaging is initialized
    if (!messaging) {
      messaging = getMessaging(app);
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    // Register the Firebase messaging service worker
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    return token;
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};

/**
 * Listen for foreground messages (when app tab is active).
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};
