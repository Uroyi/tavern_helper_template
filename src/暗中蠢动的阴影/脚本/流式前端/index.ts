import { mountStreamingMessages } from '@util/streaming';
import { createPinia } from 'pinia';
import App from './App.vue';

$(() => {
  const { unmount } = mountStreamingMessages(() => {
    return createApp(App).use(createPinia());
  }, { host: 'div' });
  $(window).on('pagehide', () => unmount());
});

