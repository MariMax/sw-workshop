(function (root) {
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
                  <svg>
                    <use xlink:href="src/heart-monitor/alive.svg#heart"></use>
                  <svg>
                </div>
            </div>
            <svg>
             <use xlink:href="src/heart-monitor/alive.svg#bounce-line"></use>
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
        rate: 60,
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
      this.timing.duration = (rate && 60 / rate * 1000) || this.timing.duration;
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
      if (!(a[0] & readyToWorkBitFormatBitMask)) return;//device not ready yet
      if (a[0] & heartRateValueFormatBitMask) { //16 bit for value
        heartRate = a[2]//just guess that it cannot be > 255
      } else heartRate = a[1];
      this.displayHeartRate(heartRate);
    }

    async onDisconnected() {
      this.stopAnimation();
      try {
        this.heartMonitorCharacteristic = await root.utils.exponentialBackoff(3, 2, root.utils.connect.bind(null, this.heatMonitorDevice, this.serviceUuid, this.characteristicUuid));
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
        this.heartMonitorCharacteristic = await root.utils.connect(this.heatMonitorDevice, this.serviceUuid, this.characteristicUuid);
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

  root.customElements.define('heart-monitor', HeartMonitorElement);
}(this))