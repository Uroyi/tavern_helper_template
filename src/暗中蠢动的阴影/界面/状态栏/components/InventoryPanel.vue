<template>
  <div class="inventory-panel">
    <!-- Header: title + gold -->
    <div class="inv-header">
      <div class="section-title">🎒 物品栏</div>
      <div class="gold-display">💰 {{ store.data.主角.金钱 }} G</div>
    </div>

    <div v-if="allEmpty" class="empty">空空如也</div>

    <template v-else>
      <!-- Category Tabs -->
      <div class="cat-tabs">
        <button
          v-for="cat in categoryTabs"
          :key="cat.cat"
          :class="['cat-tab', { active: activeCategory === cat.cat }]"
          @click="activeCategory = cat.cat"
        >
          <span class="cat-tab-icon">{{ cat.icon }}</span>
          <span class="cat-tab-label">{{ cat.cat }}</span>
          <span class="cat-tab-count">{{ cat.count }}</span>
        </button>
      </div>

      <!-- Items Grid (single category) -->
      <div class="item-grid">
        <div v-for="[name, item] in currentItems" :key="name" class="item-card">
          <div class="item-name">{{ name }}</div>
          <div class="item-count">×{{ item.数量 }}</div>
          <div class="item-desc">{{ item.描述 }}</div>
        </div>
      </div>

      <div v-if="currentItems.length === 0" class="cat-empty">暂无物品</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const CATEGORIES = [
  { cat: '武器', icon: '⚔️' },
  { cat: '消耗品', icon: '🧪' },
  { cat: '重要物品', icon: '📦' },
  { cat: 'SP工具', icon: '🔧' },
] as const;

const categoryGroups = computed(() => {
  const all = Object.entries(store.data.主角.物品栏) as [string, { 描述: string; 数量: number; 分类?: string }][];
  const grouped: Record<string, [string, { 描述: string; 数量: number; 分类?: string }][]> = {};
  for (const cat of CATEGORIES) {
    grouped[cat.cat] = [];
  }
  for (const [name, item] of all) {
    const cat = (item as any).分类 || '重要物品';
    if (grouped[cat]) {
      grouped[cat].push([name, item]);
    } else {
      grouped['重要物品'].push([name, item]);
    }
  }
  return grouped;
});

const categoryTabs = computed(() =>
  CATEGORIES.map((c) => ({
    ...c,
    count: categoryGroups.value[c.cat].length,
  }))
);

const allEmpty = computed(() => categoryTabs.value.every((g) => g.count === 0));

// Default to first non-empty category
const activeCategory = ref<string>(
  CATEGORIES.find((c) => (categoryGroups.value[c.cat]?.length ?? 0) > 0)?.cat ?? '武器'
);

const currentItems = computed(() => categoryGroups.value[activeCategory.value] || []);
</script>

<style lang="scss" scoped>
.inventory-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 2px;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-weight: bold;
  color: var(--accent-gold);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gold-display {
  font-size: 13px;
  color: var(--accent-money);
  font-weight: 700;
}

.empty {
  color: var(--text-muted);
  font-style: italic;
  font-size: 12px;
}

// Category Tabs
.cat-tabs {
  display: flex;
  gap: 0;
  background: var(--bg-card);
  border-radius: 6px;
  overflow: hidden;
}

.cat-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 6px 4px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s;

  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }

  &.active {
    color: var(--accent-gold);
    border-bottom-color: var(--accent-gold);
  }
}

.cat-tab-icon {
  font-size: 14px;
}

.cat-tab-label {
  font-size: 10px;
  font-weight: 600;
}

.cat-tab-count {
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
  border-radius: 8px;
  padding: 0 4px;

  .cat-tab.active & {
    background: rgba(255, 204, 128, 0.15);
  }
}

// Item Grid
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
}

.item-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
  transition: background 0.15s;

  &:hover {
    background: var(--hover-bg);
  }
}

.item-name {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 600;
  padding-right: 32px;
}

.item-count {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 12px;
  color: var(--accent-gold);
  font-weight: 700;
}

.item-desc {
  font-size: 10px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 2px;
}

.cat-empty {
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
  padding: 16px 0;
}
</style>
