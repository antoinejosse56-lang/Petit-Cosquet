// Service Worker - Petit Cosquet
const CACHE_NAME = 'petit-cosquet-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || '🏠 Petit Cosquet';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/Petit-Cosquet/icon-192.png',
    badge: '/Petit-Cosquet/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/Petit-Cosquet/' },
    actions: data.actions || []
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Clic sur la notification
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/Petit-Cosquet/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(clientList => {
    for (const client of clientList) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
