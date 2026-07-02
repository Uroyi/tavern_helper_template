<template>
  <div class="card" :data-theme="theme">
    <div class="card-header">
      <TabNav v-model="active_tab" :tabs="tabs" />
      <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? '切换亮色主题' : '切换暗色主题'">
        <i :class="theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
    </div>

    <div v-if="active_tab" class="content-area">
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
import { watch, onMounted } from 'vue';
import TabNav from './components/TabNav.vue';
import QuestPanel from './components/QuestPanel.vue';
import CharacterPanel from './components/CharacterPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import StatsPanel from './components/StatsPanel.vue';

const tabs = [
  { id: 'quest', label: '任务' },
  { id: 'characters', label: '角色' },
  { id: 'inventory', label: '物品' },
  { id: 'stats', label: '统计' },
];

const active_tab = useLocalStorage<string | null>('status_bar:active_tab', 'quest');
const theme = useLocalStorage<string>('status_bar:theme', 'dark');

onMounted(() => {
  document.documentElement.dataset.theme = theme.value;
});

watch(theme, (val) => {
  document.documentElement.dataset.theme = val;
});

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  line-height: 1.35;
  margin: 0 auto;
  color: var(--text-primary);
  overflow: hidden;
  position: relative;
}

.card-header {
  display: flex;
  align-items: stretch;
}

.card-header > :first-child {
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

.content-area {
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
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
