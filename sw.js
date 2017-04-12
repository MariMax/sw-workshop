var CACHE_NAME = 'cache-step-4';
var filesToCache = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/js/scripts.js',
  '/src/js/sw-setup.js',
  '/src/heart-monitor/alive.svg',
  '/src/heart-monitor/heart-monitor.css',
  '/src/heart-monitor/heart-monitor.js',
];

self.addEventListener('install', (event) => event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => cache.addAll(filesToCache))
));

// cache with network fallback
self.addEventListener('fetch', (event) => event.respondWith(
  caches.match(event.request, {cacheName:CACHE_NAME})
    .then(response => response || fetch(event.request)
    )
));

self.addEventListener('activate', (event) => {
  return event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      ))
  )
});