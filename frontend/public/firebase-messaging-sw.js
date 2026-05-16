/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAzDF6-7KyI79y-zlyH0POV8ZYcRv8tlCw",
  authDomain: "dear-desserts-notifications.firebaseapp.com",
  projectId: "dear-desserts-notifications",
  storageBucket: "dear-desserts-notifications.firebasestorage.app",
  messagingSenderId: "1033996360716",
  appId: "1:1033996360716:web:501a3b348de16a1b1ce229",
});

const messaging = firebase.messaging();

// Handle background push notifications (when tab is not active)
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  const notificationTitle = title || 'Dear Desserts';
  const notificationOptions = {
    body: body || 'You have a new update from Dear Desserts',
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    tag: 'dear-desserts-order',
    renotify: true,
    data: payload.data || {},
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderNumber = event.notification.data?.orderNumber;
  const url = orderNumber ? `/track/${orderNumber}` : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
