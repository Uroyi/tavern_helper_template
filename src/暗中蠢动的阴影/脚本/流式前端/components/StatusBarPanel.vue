<template>
  <div class="status-bar-card" :data-theme="theme">
    <div class="status-bar-header">
      <TabNav v-model="active_tab" :tabs="tabs" />
      <button
        class="theme-toggle"
        @click="toggleTheme"
        :title="theme === 'dark' ? '切换亮色主题' : '切换暗色主题'"
      >
        <i :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>

    <div v-if="active_tab" class="status-bar-content">
      <div v-if="active_tab === 'quest'" class="tab-pane active">
        <QuestPanel />
      </div>
      <div v-else-if="active_tab === 'characters'" class="tab-pane active">
        <CharacterPanel />
      </div>
      <div v-else-if="active_tab === 'inventory'" class="tab-pane active">
        <InventoryPanel />
      </div>
      <div v-else-if="active_tab === 'stats'" class="tab-pane active">
        <StatsPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import TabNav from '../../../界面/状态栏/components/TabNav.vue';
import QuestPanel from '../../../界面/状态栏/components/QuestPanel.vue';
import CharacterPanel from '../../../界面/状态栏/components/CharacterPanel.vue';
import InventoryPanel from '../../../界面/状态栏/components/InventoryPanel.vue';
import StatsPanel from '../../../界面/状态栏/components/StatsPanel.vue';
import { useDataStore } from '../../../界面/状态栏/store';
import { DECAY_RATE_PER_HOUR, CHAR_KEYS } from '../../../界面/状态栏/constants';
import '../../../界面/状态栏/global.css';

const tabs = [
  { id: 'quest', label: '任务' },
  { id: 'characters', label: '角色' },
  { id: 'inventory', label: '物品' },
  { id: 'stats', label: '统计' },
];

const active_tab = useLocalStorage<string | null>('status_bar:active_tab', 'quest');
const theme = useLocalStorage<string>('status_bar:theme', 'dark');

// Initialize the store — triggers defineMvuDataStore polling
useDataStore();

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
}

// Register spank status decay listener (moved from 界面/状态栏/index.ts)
onMounted(() => {
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
});
</script>

<style lang="scss" scoped>
.status-bar-card {
  width: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  line-height: 1.35;
  margin: 12px auto 0;
  color: var(--text-primary);
  overflow: hidden;
}

.status-bar-header {
  display: flex;
  align-items: stretch;
}

.status-bar-header > :first-child {
  flex: 1;
}

.theme-toggle {
  background: var(--bg-secondary);
  border: none;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 8px 10px;
  transition: color 0.2s;
  line-height: 1;

  &:hover {
    color: var(--accent-gold);
  }
}

.status-bar-content {
  padding: 12px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeEffect 0.3s;
}

.tab-pane.active {
  display: block;
}

@keyframes fadeEffect {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
