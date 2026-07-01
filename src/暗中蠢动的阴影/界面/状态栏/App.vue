<template>
  <div class="card">
    <TabNav v-model="active_tab" :tabs="tabs" />

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
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: #1a1a2e;
  border: 1px solid #3d3d5c;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  line-height: 1.35;
  margin: 0 auto;
  color: #d0d0e0;
  overflow: hidden;
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
