import '../css/styles.css';

import {registerHeartMonitor} from '../heart-monitor/heart-monitor';
import {registerServiceWorker} from './sw-manager';

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
}

window.utils = Utils;

registerHeartMonitor();
registerServiceWorker();