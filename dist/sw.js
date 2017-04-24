/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
	"bundle": {
		"js": "bundle.e9e585e1e0ebb05c6785.js",
		"css": "bundle.e9e585e1e0ebb05c6785.css"
	},
	"metadata": {
		"version": "1.0.1"
	}
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _assets = __webpack_require__(0);

var assets = _interopRequireWildcard(_assets);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

importScripts('/sw-precaching.js', '/sw-routing.js', '/sw-broadcast-cache-update.js', '/sw-runtime-caching.js', '/sw-cache-expiration.js');

const swVersion = assets.metadata.version;
const CACHE_NAME = `cache-step-8-${swVersion}`;

const revCacheManager = new goog.precaching.RevisionedCacheManager();
revCacheManager.addToCacheList({
  revisionedFiles: ['index.html', {
    url: '/',
    revision: swVersion
  }]
});

const unrevCacheManager = new goog.precaching.UnrevisionedCacheManager();
unrevCacheManager.addToCacheList({
  unrevisionedFiles: ['/']
});

self.addEventListener('install', event => {
  const promiseChain = Promise.all([revCacheManager.install(), unrevCacheManager.install()]);
  event.waitUntil(promiseChain.then(() => self.skipWaiting()));
});

const jsRequestWrapper = new goog.runtimeCaching.RequestWrapper({
  cacheName: `js-cache-${swVersion}`,
  plugins: [new goog.cacheExpiration.Plugin({
    // maxEntries: 2,
    maxAgeSeconds: 1
  })]
});

const jsRoute = new goog.routing.RegExpRoute({
  regExp: /\.js$/,
  handler: new goog.runtimeCaching.CacheFirst()
}, null, jsRequestWrapper);

const cssRequestWrapper = new goog.runtimeCaching.RequestWrapper({
  cacheName: `css-cache-${swVersion}`
});

const cssRoute = new goog.routing.RegExpRoute({
  regExp: /\.css$/,
  // match: ({url}) => url.domain === 'example.com',
  handler: new goog.runtimeCaching.NetworkFirst()
}, 300, cssRequestWrapper);

const router = new goog.routing.Router();
router.registerRoute({ route: jsRoute });
router.registerRoute({ route: cssRoute });

self.addEventListener('activate', event => {
  const promiseChain = Promise.all([revCacheManager.cleanup(), unrevCacheManager.cleanup()]);
  event.waitUntil(promiseChain
  // .then(() => self.clients.matchAll({includeUncontrolled: true, type: 'window'}))
  .then(() => self.clients.matchAll()).then(clients => clients.forEach(client => client.postMessage({ payload: swVersion, topic: 'update' }))));
});

/***/ })
/******/ ]);