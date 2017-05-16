export class SWService {
  static swAvailable = false;

  static swInstalled = false;

  static async installSW() {
    if (!navigator.serviceWorker) {
      SWService.swAvailable = false;
      SWService.swInstalled = false;
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('sw.js');
      SWService.swAvailable = true;
      SWService.swInstalled = true;
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    } catch (err) {
      SWService.swAvailable = true;
      SWService.swInstalled = false;
      console.log('ServiceWorker registration failed: ', err);
    };
  }
}