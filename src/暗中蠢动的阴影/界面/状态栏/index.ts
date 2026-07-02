import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

$(async () => {
  await waitGlobalInitialized('Mvu');
  await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

  // ---- Spank status decay on variable updates ----
  const CHAR_KEYS = ['菲尔', '艾莉西亚', '赛拉', '米莉', '艾琳', '露露拉拉', '哈尼', '玛丽亚'];
  const DECAY_RATE_PER_HOUR = 50;

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

  createApp(App).use(createPinia()).mount('#app');
});
