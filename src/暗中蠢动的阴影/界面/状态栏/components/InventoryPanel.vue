<template>
  <div class="inventory-panel">
    <div class="section-title">🎒 物品栏</div>
    <div v-if="items.length === 0" class="empty">空空如也</div>
    <div v-for="[name, item] in items" :key="name" class="item-row">
      <div class="item-name">{{ name }}</div>
      <div class="item-count">×{{ item.数量 }}</div>
      <div class="item-desc">{{ item.描述 }}</div>
    </div>
    <div class="gold-row">
      <span>💰 {{ store.data.主角.金钱 }} G</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const items = computed(() => Object.entries(store.data.主角.物品栏));
</script>

<style lang="scss" scoped>
.inventory-panel {
  .section-title {
    font-weight: bold; color: #ffcc80; font-size: 12px;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .empty { color: #666688; font-style: italic; font-size: 12px; }
}
.item-row {
  padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
  display: grid; grid-template-columns: 1fr auto; gap: 2px 8px;
  .item-name { font-size: 12px; color: #c0c0e0; }
  .item-count { font-size: 12px; color: #ffcc80; grid-column: 2; grid-row: 1 / 3; align-self: center; }
  .item-desc { font-size: 11px; color: #7777aa; grid-column: 1; }
}
.gold-row { margin-top: 10px; font-size: 13px; color: #ffd54f; text-align: right; }
</style>
