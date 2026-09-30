// Generado con IA (Claude - ERC AI Workspace) - Restringido
// Service worker de Tableros ERC: guarda la estructura de la app para abrirla rápido.
// Los datos de los tableros NO se guardan aquí; siempre se consultan en línea.
const VERSION = 'tableros-erc-v4';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './logo-erc.png', './oxec-ii.jpg',
  './erc-app-192.png', './erc-app-512.png', './erc-app-180.png', './erc-app-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Solo atiende archivos propios de la app: primero la red y, sin conexión, la copia guardada.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
