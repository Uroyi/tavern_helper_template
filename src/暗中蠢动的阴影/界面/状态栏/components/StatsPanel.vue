<template>
  <div class="stats-panel">
    <!-- Attributes -->
    <div class="section">
      <div class="section-title">⚔️ 属性</div>
      <div class="stats-grid">
        <div class="stat" v-for="s in stats" :key="s.label">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-value">{{ s.value }}</span>
        </div>
      </div>
    </div>

    <!-- Spank Statistics -->
    <div class="section">
      <div class="section-title">👋 打屁股统计</div>
      <div class="total-spanks">总计: {{ store.data.主角.打屁股统计.总次数 }} 次</div>
      <div class="spank-list">
        <div v-for="s in spankStats" :key="s.name" class="spank-row">
          <span class="spank-name">{{ s.name }}</span>
          <span class="spank-count">{{ s.count }}次</span>
        </div>
      </div>
    </div>

    <!-- Achievements -->
    <div class="section" v-if="achievementEntries.length > 0">
      <div class="section-title">🏆 成就</div>
      <div v-for="[name, done] in achievementEntries" :key="name" class="ach-row">
        <span :class="done ? 'ach-done' : 'ach-pending'">{{ done ? '✓' : '○' }}</span>
        <span :class="done ? 'ach-text-done' : 'ach-text-pending'">{{ name }}</span>
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

const ALL_SPANK_CHARS = ['菲尔', '艾莉西亚', '赛拉', '米莉', '艾琳', '露露', '拉拉', '玛丽亚'];

const spankStats = computed(() => {
  const s = store.data.主角.打屁股统计 as Record<string, number>;
  return ALL_SPANK_CHARS.map((name) => ({
    name,
    count: s[name] || 0,
  }));
});

const achievementEntries = computed(() => Object.entries(store.data.主角.成就).filter(([, v]) => v));
</script>

<style lang="scss" scoped>
.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 10px 12px;
}

.section-title {
  font-weight: bold;
  color: var(--accent-gold);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

// Attributes
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;

  .stat-label { color: var(--text-secondary); }
  .stat-value { color: var(--accent-gold); font-weight: bold; }
}

// Spank Stats
.total-spanks {
  font-size: 14px;
  color: var(--accent-red);
  font-weight: bold;
  margin-bottom: 8px;
}

.spank-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 2px 0;
}

.spank-name {
  color: var(--text-primary);
}

.spank-count {
  color: var(--accent-pink);
  font-weight: 700;
  font-size: 13px;
}

// Achievements
.ach-row {
  font-size: 11px;
  padding: 2px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ach-done {
  color: var(--accent-green);
  font-weight: bold;
}

.ach-pending {
  color: var(--text-muted);
}

.ach-text-done {
  color: var(--accent-green);
}

.ach-text-pending {
  color: var(--text-muted);
}
</style>
