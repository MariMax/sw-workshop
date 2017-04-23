import * as assets from './src/assets.json';

const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-6-${swVersion}`;

const files = Object.keys(assets.bundle).map(key=>`/${assets.bundle[key]}`);
const filesToCache = files.concat([
  '/',
  '/index.html',
]);

self.addEventListener('install', (event) => event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => cache.addAll(filesToCache))
    .then(()=>self.skipWaiting())
));

// cache with network fallback
self.addEventListener('fetch', (event) => event.respondWith(
  caches.match(event.request)
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