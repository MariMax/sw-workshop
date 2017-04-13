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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHeartMonitor = undefined;

__webpack_require__(5);

class HeartMonitorElement extends HTMLElement {
  constructor() {
    super();
    this.handleNotifications = this.handleNotifications.bind(this);
    this.onDisconnected = this.onDisconnected.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
    this.animationIteration = this.animationIteration.bind(this);
    const template = `
        <button class="heart">
            <div class="vlaue-group">
                <div class="value">
                    ---
                </div>
                <div class="value-name">
                  <div class="bpm">
                    bpm
                  </div>
                  <svg viewBox="0 0 128 128">
                    <path fill="currentColor" d="M64.425 19.75l-.46-.462c-13.72-13.717-35.96-13.717-49.677 0C.57 33.006.57 55.246 14.288 68.964l49.676 49.676.46-.46.46.46 49.677-49.676c13.72-13.718 13.72-35.958 0-49.676-13.715-13.717-35.955-13.717-49.673 0l-.46.46z"/>
                  <svg>
                </div>
            </div>
            <svg viewBox="5 197 590 205">
             <path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="
                  M10,342L223,342
                  c 7.5,0 22.4,-22.3 32,-15
                  c 10,10 16,50 22,30
                  c 5,-15 -0,-50 3,-145
                  c 0,-14 6,-14  6,0
                  c 1,185 6,185 10,185
                  c 4,-4 10,-68 19,-68
                  c 10,-2 10,14 20,13
                  l 255,0
            "/>
            </svg>
        </button>    
    `;
    this.innerHTML = template;
  }

  connectedCallback() {
    this.heartMonitor = this.querySelector('.heart');
    this.heartRateValue = this.querySelector('.value');
    this.heartIcon = this.querySelector('.value-name  svg');
    this.heatMonitorDevice = null;
    this.heartMonitorCharacteristic = null;
    this.initialization = false;
    this.serviceUuid = 'heart_rate';
    this.characteristicUuid = 'heart_rate_measurement';
    this.iteration = 0;
    this.timing = {
      duration: 1000,
      rate: 60
    };

    this.heartMonitor.addEventListener('click', this.onClickHandler);
    this.heartIcon.addEventListener('animationend', this.animationIteration);
  }

  onClickHandler() {
    if (this.initialization) return;
    this.initialization = true;
    return this.subscribeToHRUpdates();
  }

  startAnimation() {
    if (this.heartMonitor.classList.contains('bounce-line-animation')) return;
    this.heartMonitor.style.setProperty('--animation-duration', this.timing.duration);
    this.heartMonitor.style.setProperty('--heart-rate-hue', 170 - this.timing.rate > 0 ? 170 - this.timing.rate : 0);
    this.heartMonitor.classList.add('bounce-line-animation');
    this.heartIcon.classList.add('heart-beat-animation');
    this.heartMonitor.classList.add('animate');
  }

  animationIteration() {
    this.heartMonitor.classList.remove('bounce-line-animation');
    this.heartIcon.classList.remove('heart-beat-animation');
    this.heartMonitor.style.setProperty('--animation-duration', this.timing.duration);
    this.heartMonitor.style.setProperty('--heart-rate-hue', 170 - this.timing.rate > 0 ? 170 - this.timing.rate : 0);
    setTimeout(this.startAnimation);
  }

  stopAnimation() {
    this.heartMonitor.classList.remove('bounce-line-animation');
    this.heartIcon.classList.remove('heart-beat-animation');
    this.heartMonitor.classList.remove('animate');
    this.heartRateValue.innerText = '---';
  }

  displayHeartRate(rate) {
    this.timing.duration = rate && 60 / rate * 1000 || this.timing.duration;
    this.timing.rate = rate || this.timing.rate;
    this.heartRateValue.innerText = this.timing.rate;

    return this.startAnimation();
  }

  handleNotifications(event) {
    const value = event.target.value;
    const a = [];
    for (let i = 0; i < value.byteLength; i++) {
      a.push(value.getUint8(i));
    }
    const heartRateValueFormatBitMask = 0b00000001;
    const readyToWorkBitFormatBitMask = 0b00010000;
    let heartRate;
    if (!(a[0] & readyToWorkBitFormatBitMask)) return; //device not ready yet
    if (a[0] & heartRateValueFormatBitMask) {
      //16 bit for value
      heartRate = a[2]; //just guess that it cannot be > 255
    } else heartRate = a[1];
    this.displayHeartRate(heartRate);
  }

  async onDisconnected() {
    this.stopAnimation();
    try {
      this.heartMonitorCharacteristic = await utils.exponentialBackoff(3, 2, utils.connect.bind(null, this.heatMonitorDevice, this.serviceUuid, this.characteristicUuid));
      await this.heartMonitorCharacteristic.startNotifications();
      return this.heartMonitorCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotifications);
    } catch (error) {
      this.initialization = false;

      //show disconnected error
    }
  }

  async subscribeToHRUpdates() {
    if (!navigator.bluetooth) return;

    try {
      this.heatMonitorDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [this.serviceUuid] }]
      });
      this.heatMonitorDevice.addEventListener('gattserverdisconnected', this.onDisconnected);
      this.heartMonitorCharacteristic = await utils.connect(this.heatMonitorDevice, this.serviceUuid, this.characteristicUuid);
      await this.heartMonitorCharacteristic.startNotifications();
      return this.heartMonitorCharacteristic.addEventListener('characteristicvaluechanged', this.handleNotifications);
    } catch (error) {
      if (this.heatMonitorDevice) {
        return this.onDisconnected();
      }
      //show connection failed
      this.initialization = false;
    }
  }
}

const registerHeartMonitor = exports.registerHeartMonitor = () => customElements.define('heart-monitor', HeartMonitorElement);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerServiceWorker = registerServiceWorker;

var _toaster = __webpack_require__(4);

async function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.onmessage = e => e.data.topic === 'update' && _toaster.Toaster.create('Web app updated. Refresh for better UX!');
  try {
    const registration = await navigator.serviceWorker.register('sw.js');
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  } catch (err) {
    console.log('ServiceWorker registration failed: ', err);
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var _heartMonitor = __webpack_require__(0);

var _swManager = __webpack_require__(1);

class Utils {
  static async exponentialBackoff(max, delay, connect) {
    if (max > 0) {
      try {
        return await connect();
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        delay *= 2;
        max--;
        return await window.utils.exponentialBackoff(max, delay, connect);
      }
    }
    throw new Error('device unavailable');
  }

  static async connect(device, serviceUuid, characteristicUuid) {
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(serviceUuid);
    const characteristic = await service.getCharacteristic(characteristicUuid);
    return characteristic;
  }
}

window.utils = Utils;

(0, _heartMonitor.registerHeartMonitor)();
(0, _swManager.registerServiceWorker)();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toaster = undefined;

__webpack_require__(6);

class Toaster {
  static create(msg, options) {
    var toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.classList.add('toast-container');
      document.body.appendChild(toastContainer);
    }
    options = options || {};
    var tag = options.tag || Date.now().toString();
    Array.from(toastContainer.querySelectorAll(`.toast[data-tag="${tag}"]`)).forEach(t => {
      t.parentNode.removeChild(t);
    });

    // Make a toast...
    var toast = document.createElement('div');
    var toastContent = document.createElement('div');
    toast.classList.add('toast');
    toastContent.classList.add('toast__content');
    toastContent.textContent = msg;
    toast.appendChild(toastContent);
    toast.dataset.tag = tag;
    toastContainer.appendChild(toast);

    // Wait a few seconds, then fade it...
    var timeout = options.timeout || 3000;
    setTimeout(() => {
      toast.classList.add('toast--dismissed');
    }, timeout);

    // After which, remove it altogether.
    toast.addEventListener('transitionend', function (evt) {
      evt.target.parentNode.removeChild(evt.target);
    });
  }
}
exports.Toaster = Toaster;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);