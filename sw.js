importScripts('/sw-precaching.js', '/sw-routing.js', '/sw-runtime-caching.js', '/sw-cache-expiration.js');

import * as assets from './src/assets.json';

const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-8-${swVersion}`;

const revCacheManager = new goog.precaching.RevisionedCacheManager();
revCacheManager.addToCacheList({
  revisionedFiles: [
    'index.html',
    {
      url: '/',
      revision: swVersion,
    }
  ],
});

const unrevCacheManager = new goog.precaching.UnrevisionedCacheManager();
unrevCacheManager.addToCacheList({
  unrevisionedFiles: [
    '/',
  ]
});

self.addEventListener('install', (event) => {
  const promiseChain = Promise.all([
    revCacheManager.install(),
    unrevCacheManager.install(),
  ]);
  event.waitUntil(
    promiseChain
      .then(() => self.skipWaiting())
  );
});

const jsRequestWrapper = new goog.runtimeCaching.RequestWrapper({
  cacheName: `js-cache-${swVersion}`,
  plugins: [
    new goog.cacheExpiration.Plugin({
      // maxEntries: 2,
      maxAgeSeconds: 1,
    })
  ]
});

const jsRoute = new goog.routing.RegExpRoute({
  regExp: /\.js$/,
  handler: new goog.runtimeCaching.CacheFirst(),
}, null, jsRequestWrapper);

const cssRequestWrapper = new goog.runtimeCaching.RequestWrapper({
  cacheName: `css-cache-${swVersion}`,
});

const cssRoute = new goog.routing.RegExpRoute({
  regExp: /\.css$/,
  // match: ({url}) => url.domain === 'example.com',
  handler: new goog.runtimeCaching.NetworkFirst(),
}, 300, cssRequestWrapper);

const router = new goog.routing.Router();
router.registerRoute({ route: jsRoute });
router.registerRoute({ route: cssRoute });

self.addEventListener('activate', (event) => {
  const promiseChain = Promise.all([
    revCacheManager.cleanup(),
    unrevCacheManager.cleanup()
  ]);
  event.waitUntil(
    promiseChain
      .then(() => self.clients.matchAll({includeUncontrolled: true, type: 'window'}))
      .then(clients => clients.forEach(client => client.postMessage({ payload: swVersion, topic: 'update' })))
  );
});