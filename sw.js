var CACHE_NAME = 'cache-v1';
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

// // cache with network fallback
// self.addEventListener('fetch', (event) => event.respondWith(
//     caches.match(event.request)
//       .then(response => response || fetch(event.request)
//     )
//   ));

//network with cache fallback
self.addEventListener('fetch', (event) => event.respondWith(
  fetch(event.request)
    .then(response => {
      if (response.status >= 200 && response.status < 400) return response;
      return caches.match(event.request)
    })
));

// //network/cache race
// function promiseAny(promises) {
//   return new Promise((resolve, reject) => {
//     // make sure promises are all promises
//     promises = promises.map(p => Promise.resolve(p));
//     // resolve this promise as soon as one resolves
//     promises.forEach(p => p.then(resolve));
//     // reject if all promises reject
//     promises.reduce((a, b) => a.catch(() => b))
//       .catch(() => reject(Error("All failed")));
//   });
// };

// self.addEventListener('fetch', (event) => event.respondWith(
//   promiseAny([
//       caches.match(event.request),
//       fetch(event.request)
//     ])
// ));

// cache first network later
// generic offline response