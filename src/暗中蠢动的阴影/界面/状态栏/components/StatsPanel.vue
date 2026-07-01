<template>
  <div class="stats-panel">
    <div class="section">
      <div class="section-title">⚔️ 属性</div>
      <div class="stats-grid">
        <div class="stat" v-for="s in stats" :key="s.label">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-value">{{ s.value }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">👋 打屁股统计</div>
      <div class="total-spanks">总计: {{ store.data.主角.打屁股统计.总次数 }}次</div>
      <div class="spank-list">
        <div v-for="s in spankStats" :key="s.name" class="spank-row">
          <span class="spank-name">{{ s.name }}</span>
          <span class="spank-count">{{ s.count }}次</span>
        </div>
      </div>
    </div>

    <div class="section" v-if="achievementEntries.length > 0">
      <div class="section-title">🏆 成就</div>
      <div v-for="[name, done] in achievementEntries" :key="name" class="ach-row">
        <span :class="done ? 'ach-done' : 'ach-pending'">{{ done ? '✓' : '○' }}</span>
        <span>{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const stats = computed(() => [
  { label: '攻击力', value: store.data.主角.属性.攻击力 },
  { label: '防御力', value: store.data.主角.属性.防御力 },
  { label: '魔力', value: store.data.主角.属性.魔力 },
  { label: '生命值', value: store.data.主角.属性.生命值 },
]);

const spankStats = computed(() => {
  const s = store.data.主角.打屁股统计;
  return [
    { name: '菲尔', count: s.菲尔 },
    { name: '艾莉西亚', count: s.艾莉西亚 },
    { name: '赛拉', count: s.赛拉 },
    { name: '艾琳', count: s.艾琳 },
    { name: '米莉', count: s.米莉 },
    { name: '露露', count: s.露露 },
    { name: '拉拉', count: s.拉拉 },
  ].filter(x => x.count > 0);
});

const achievementEntries = computed(() => Object.entries(store.data.主角.成就).filter(([, v]) => v));
</script>

<style lang="scss" scoped>
.stats-panel { display: flex; flex-direction: column; gap: 10px; }
.section {
  background: rgba(255,255,255,0.03); border-radius: 6px; padding: 10px;
  .section-title {
    font-weight: bold; color: #ffcc80; font-size: 12px;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
  }
}
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
.stat { display: flex; justify-content: space-between; font-size: 12px;
  .stat-label { color: #8888aa; } .stat-value { color: #ffcc80; font-weight: bold; }
}
.total-spanks { font-size: 14px; color: #ef5350; font-weight: bold; margin-bottom: 4px; }
.spank-row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;
  .spank-name { color: #c0c0e0; } .spank-count { color: #ff8a80; }
}
.ach-row { font-size: 11px; padding: 1px 0; color: #81c784; }
.ach-pending { color: #555577; }
</style>
