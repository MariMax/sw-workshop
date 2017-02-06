(function () {
  const heartMonitor = document.querySelector('.heart');
  let animation;
  let heatMonitorDevice;
  let heartMonitorCharacteristic;
  let initialization = false;
  let device;
  const serviceUuid = 'heart_rate';
  const characteristicUuid = 'heart_rate_measurement';
  const timing = {
    iterations: 1,
    easing: 'linear',
    duration: 1000,
  };
  const keyframes = [
    {strokeDashoffset:200, offset: 0},
    {strokeDashoffset:-1006, offset: 1},
  ];
  let valuesQueue = [];
  
  const animateBeat = () => {
    timing.duration = valuesQueue.pop() || timing.duration;
    animation = heartMonitor.animate(keyframes, timing);
    animation.onfinish = () => animateBeat();
  }

  const displayHeartRate = (rate) => {
    valuesQueue.push(rate ? 60/rate * 1000: 1000);
    console.log(valuesQueue);
    heartMonitor.classList.add('animate');
    !animation && animateBeat();
  }

  const handleNotifications = (event) => {
    let value = event.target.value;
    let a = [];
    for (let i = 0; i < value.byteLength; i++) {
      a.push(value.getUint8(i));
    }
    const heartRateValueFormatBitMask = 0b00000001;
    const readyToWorkBitFormatBitMask = 0b00010000;
    let heartRate;
    if (!(a[0] & readyToWorkBitFormatBitMask)) return;//device not ready yet
    if (a[0] & heartRateValueFormatBitMask) { //16 bit for value
      heartRate = a[2]//just guess that it cannot be > 255
    } else heartRate = a[1];
    displayHeartRate(heartRate);

  };

  const onDisconnected = async () => {
    heartMonitor.classList.remove('animate');
    animation && animation.cancel();
    animation = null;
    try {
      heartMonitorCharacteristic = await window.utils.exponentialBackoff(3, 2, window.utils.connect.bind(null, heatMonitorDevice, serviceUuid, characteristicUuid));
      await heartMonitorCharacteristic.startNotifications();
      heartMonitorCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);
    } catch (error) {
      initialization = false;

      //show disconnected error
    }
  };

  const subscribeToHRUpdates = async () => {

    try {
      heatMonitorDevice = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }]
      });
      heatMonitorDevice.addEventListener('gattserverdisconnected', onDisconnected);
      heartMonitorCharacteristic = await window.utils.connect(heatMonitorDevice, serviceUuid, characteristicUuid);
      await heartMonitorCharacteristic.startNotifications();
      heartMonitorCharacteristic.addEventListener('characteristicvaluechanged', handleNotifications);

    } catch (error) {
      if (heatMonitorDevice) {
        return onDisconnected();
      }
      //show connection failed
      initialization = false;
    }
  }

  heartMonitor.addEventListener('click', (event) => {
    if (initialization) return;
    initialization = true;
    return subscribeToHRUpdates();
  });

}())