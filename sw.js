var CACHE_NAME = 'cache-step-1';
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

self.addEventListener('install', (event) => {
  return event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(filesToCache))
  );
});