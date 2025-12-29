self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new SW immediately
});

self.addEventListener('activate', event => {
  self.clients.claim(); // Take control of all clients
  // Notify all clients to reload for the latest version
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'RELOAD_PAGE' });
    });
  });
});

self.addEventListener('fetch', event => {
  // Basic offline fallback: try cache, then network
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
