const CACHE_NAME = 'memory-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/database.js',
  '/main.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // 注意：我们不需要缓存 Croppie，因为它是在线的
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});