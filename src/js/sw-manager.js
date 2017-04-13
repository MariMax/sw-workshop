import {Toaster} from '../toaster/toaster';

export async function registerServiceWorker() {
  if (!navigator.serviceWorker) return;
  
  navigator.serviceWorker.onmessage = (e) => e.data.topic === 'update' && Toaster.create('Web app updated. Refresh for better UX!');
  try {
    const registration = await navigator.serviceWorker.register('sw.js');
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  } catch (err) {
    console.log('ServiceWorker registration failed: ', err);
  };
}