import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh the page');
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});
