import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';
import { DECAY_RATE_PER_HOUR, CHAR_KEYS } from './constants';

$(async () => {
  try {
    await Promise.race([
      waitGlobalInitialized('Mvu'),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('MVU initialization timeout')), 10000)),
    ]);
    await Promise.race([
      waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'), { timeout: 15000 }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('stat_data not found')), 15000)),
    ]);
  } catch (err) {
    console.error('[StatusBar] Initialization failed:', err);
    $('#app').text('状态栏加载失败: ' + (err instanceof Error ? err.message : String(err)));
    return;
  }

  // ---- Spank status decay on variable updates ----
  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, (newVariables: any) => {
    const now = Date.now();
    CHAR_KEYS.forEach((name) => {
      const path = `stat_data.${name}.臀部状态`;
      const status = _.get(newVariables, path);
      if (!status || !status.红肿度 || status.红肿度 <= 0) return;

      const lastUpdate = status.最近更新时间 || 0;
      if (lastUpdate === 0) return;

      const hoursElapsed = (now - lastUpdate) / (1000 * 60 * 60);
      if (hoursElapsed <= 0) return;

      const decayed = Math.max(0, Math.round(status.红肿度 - DECAY_RATE_PER_HOUR * hoursElapsed));
      if (decayed !== status.红肿度) {
        _.set(newVariables, `${path}.红肿度`, decayed);
        _.set(newVariables, `${path}.最近更新时间`, now);
      }
    });
  });

  try {
    createApp(App).use(createPinia()).mount('#app');
  } catch (err) {
    console.error('[StatusBar] Vue mount failed:', err);
    $('#app').text('状态栏渲染失败');
  }
});
