const swVersion = '1.0.0';
const CACHE_NAME = `cache-step-5-${swVersion}`;
const filesToCache = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/js/scripts.js',
  '/src/js/sw-manager.js',
  '/src/heart-monitor/alive.svg',
  '/src/heart-monitor/heart-monitor.css',
  '/src/heart-monitor/heart-monitor.js',
  '/src/toaster/toaster.js',
  '/src/toaster/toaster.css',
];

self.addEventListener('install', (event) => event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => cache.addAll(filesToCache))
    .then(()=>self.skipWaiting())
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
      .then(() => self.clients.matchAll({includeUncontrolled: true, type: 'window'}))
      .then(clients=>clients.forEach(client=>client.postMessage({payload:swVersion, topic:'update'})))
  )
});