importScripts('workbox-precaching.js', 'workbox-routing.js');

import * as assets from './src/assets.json';
import * as idbKeyVal from 'idb-keyval';


const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-9-${swVersion}-${new Date().valueOf()}`;
const filesToCache = Object.keys(assets.main).reduce((r, key) => [...r, assets.main[key]], []);


const revCacheManager = new workbox.precaching.RevisionedCacheManager();
revCacheManager.addToCacheList({
  revisionedFiles: [
    {
      url: '/',
      revision: CACHE_NAME,
    },
    {
      url: '/index.html',
      revision: CACHE_NAME,
    },
    ...filesToCache.map(i => ({ url: `/${i}`, revision: CACHE_NAME })),
  ],
});

self.addEventListener('install', (event) => event.waitUntil(
  revCacheManager.install()
    .then(() => self.skipWaiting())
));

self.addEventListener('activate', (event) => event.waitUntil(
  revCacheManager.cleanup()
    .then(() => self.clients.matchAll({ includeUncontrolled: true, type: 'window' }))
    .then(clients => clients.forEach(client => client.postMessage({ payload: CACHE_NAME, topic: 'update' })))
));

const headers = (request) => {
  return idbKeyVal.keys()
    .then(keys => Promise.all(keys.map(key => idbKeyVal.get(key))))
    .then(items => {
      const response = items.reduce((r, i) => {
        const item = JSON.parse(i);
        const header = item.header;
        const articleId = item.id;
        const lastUpdate = item.lastUpdate;
        const results = [...r, { header, articleId, lastUpdate }];
        return results;
      }, []);
      return new Response(JSON.stringify(response));
    });
}

const article = (request) => {
  const articleId = request.url.replace(/^.*\//, '');
  return idbKeyVal.get(articleId)
    .then(item => new Response(item));
}

const handlers = {
  headers,
  article,
}

const router = new workbox.routing.Router();

const staticFilesRoute = new workbox.routing.RegExpRoute({
  regExp: /^((?!api).)*$/,
  handler: ({ event }) => caches.match(event.request).catch(() => fetch(event.request)),
});

const dataRoutes = new workbox.routing.RegExpRoute({
  regExp: /api\/(\w+)/,
  handler: ({ event, params }) => fetch(event.request)
  .then(response => {
    if (response.ok)
      return response;
    throw new Error('something bad happened, let the catch do its work');
  })
  .catch(() => handlers[params[0]](event.request)),
});

router.registerRoutes({
  routes: [staticFilesRoute, dataRoutes],
})


// router.setDefaultHandler({
  // handler: ({ event }) => fetch(event.request)
// });