const CACHE_NAME = 'awc-v18-cache-v2';
const urlsToCache = [
  '/Awcv1/',
  '/Awcv1/index.html',
  '/Awcv1/manifest.json',
  '/Awcv1/icon-192.png',
  '/Awcv1/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => caches.match(event.request).then(res => res || caches.match('/Awcv1/index.html')))
  );
});
