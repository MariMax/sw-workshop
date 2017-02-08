(function () {
  function installSW() {

  }


  if (navigator.serviceWorker) {
    installSW();
  }

  if (!navigator.bluetooth) {
    //show notification
    return;
  }

  window.utils = {
    async exponentialBackoff(max, delay, connect) {
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
      // window.utils.disableNoSleep();
      throw new Error('device unavailable');
    },
    async connect(device, serviceUuid, characteristicUuid) {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUuid);
      const heartMonitorCharacteristic = await service.getCharacteristic(characteristicUuid);
      // window.utils.enableNoSleep();
      return heartMonitorCharacteristic;
    },
    loadScript(url, async) {
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
  }

  // window.utils.loadScript('noSleep.js', true)
    // .then(() => {
      // const noSleep = new NoSleep();
      // window.utils = Object.assign({}, window.utils, {
        // enableNoSleep: noSleep.enable.bind(noSleep),
        // disableNoSleep: noSleep.disable.bind(noSleep),
      // });
    // });
  window.utils.loadScript('heartMonitor.js', true);

}())