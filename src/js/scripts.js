(function () {
  class Utils {
    static async exponentialBackoff(max, delay, connect) {
      if (max > 0) {
        try {
          return await connect();
        } catch (error) {
          await new Promise(resolve => setTimeout(resolve, delay * 1000))
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

    static loadScript(url, async) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        if (typeof async !== 'undefined') {
          script.async = async;
        }

        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    static loadStyles(url) {
      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.returnType = 'text';
        xhr.onload = function () {
          var link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = url;
          document.head.appendChild(link);
          resolve();
        };
        xhr.onerror = reject;
        xhr.open('get', url);
        xhr.send();
      });
    }
  }

  window.utils = Utils;

  window.utils.loadStyles('/src/heart-monitor/heart-monitor.css');
  window.utils.loadScript('/src/heart-monitor/heart-monitor.js', true);

  window.utils.loadStyles('/src/toaster/toaster.css');
  window.utils.loadScript('/src/toaster/toaster.js', true);

  window.utils.loadScript('/src/js/sw-manager.js', false);
}())