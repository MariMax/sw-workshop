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
          return await window.utils.exponentialBackoff(max,delay,connect);
        }
      }
      throw new Error('device unavailable');
    },
    async connect(device, serviceUuid, characteristicUuid) {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUuid);
      const heartMonitorCharacteristic = await service.getCharacteristic(characteristicUuid);
      return heartMonitorCharacteristic;
    },
    loadScript(path) {

    }
  }

}())