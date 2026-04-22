// Raiz. Patio & Mercado — Service Worker
// Maneja notificaciones aunque la app este cerrada o pantalla bloqueada

var CACHE_NAME = 'raiz-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Recibe mensaje desde la app para mostrar notificacion
self.addEventListener('message', function(e) {
  if (!e.data) return;
  if (e.data.type === 'SHOW_NOTIF') {
    var opts = {
      body: e.data.body || 'Nueva comanda',
      icon: e.data.icon || '',
      badge: e.data.icon || '',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'comanda-raiz',
      renotify: true,
      requireInteraction: false,
      silent: false,
      data: { url: e.data.url || '/' }
    };
    e.waitUntil(
      self.registration.showNotification(e.data.title || 'Raiz. Bartender', opts)
    );
  }
});

// Cuando el usuario toca la notificacion, abre/enfoca la app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var targetUrl = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cs) {
      // Si ya hay una ventana abierta, enfocarla
      for (var i = 0; i < cs.length; i++) {
        if ('focus' in cs[i]) {
          cs[i].focus();
          return;
        }
      }
      // Si no hay ventana, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
