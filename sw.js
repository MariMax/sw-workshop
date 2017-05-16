importScripts('/sw-precaching.js');

import * as assets from './src/assets.json';

const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-9-${swVersion}`;
const filesToCache = Object.keys(assets.main).reduce((r, key) => [...r, assets.main[key]], []);

const revCacheManager = new goog.precaching.RevisionedCacheManager();
revCacheManager.addToCacheList({
  revisionedFiles: [
    'index.html',
    {
      url: '/',
      revision: swVersion,
    },
    ...filesToCache.map(i => ({ url: `/${i}`, revision: swVersion })),
  ],
});

self.addEventListener('install', (event) => {
  const promiseChain = Promise.all([
    revCacheManager.install()
  ]);
  event.waitUntil(
    promiseChain
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => event.respondWith(
  caches.match(event.request)
    .then(response => response || fetch(event.request)
    )
));

self.addEventListener('activate', (event) => {
  const promiseChain = Promise.all([
    revCacheManager.cleanup(),
  ]);
  event.waitUntil(
    promiseChain
      .then(() => self.clients.matchAll({ includeUncontrolled: true, type: 'window' }))
      .then(clients => clients.forEach(client => client.postMessage({ payload: swVersion, topic: 'update' })))
  );
});