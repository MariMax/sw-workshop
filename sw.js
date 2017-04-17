var CACHE_NAME = 'cache-step-3';
var filesToCache = [
  '/',
  '/index.html',
  '/src/css/styles.css',
  '/src/js/scripts.js',
];

self.addEventListener('install', (event) => event.waitUntil(
  caches.open(CACHE_NAME)
    .then(cache => cache.addAll(filesToCache))
));

// // cache with network fallback
// self.addEventListener('fetch', (event) => event.respondWith(
//     caches.match(event.request, {cacheName:CACHE_NAME})
//       .then(response => response || fetch(event.request)
//     )
//   ));

// //network with cache fallback
// self.addEventListener('fetch', (event) => event.respondWith(
//   fetch(event.request)
//     .then(response => {
//       if (response.status >= 200 && response.status < 400) return response;
//       return caches.match(event.request, {cacheName:CACHE_NAME})
//     })
// ));

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
//       caches.match(event.request, {cacheName:CACHE_NAME}),
//       fetch(event.request)
//     ])
// ));

// cache first network later
// generic offline response

// network request and put data into the cache
self.addEventListener('fetch', (event) => event.respondWith(
  caches.match(event.request, {cacheName:CACHE_NAME})
    .then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      const request = event.request.clone();

      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            //smth wrong
            return response;
          }

          const responseForCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseForCache));
          return response;
        })
    })
));