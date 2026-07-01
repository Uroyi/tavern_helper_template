<template>
  <div class="shop-card">
    <div class="shop-header">🛍️ {{ name }}</div>
    <div class="shop-items">
      <div v-for="(item, i) in items" :key="i" class="shop-row">
        <span class="shop-item-name">{{ item.text }}</span>
        <span class="shop-item-price">{{ item.price }} G</span>
      </div>
    </div>
    <div class="shop-footer">──────────</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ name: string; items: Array<{ text: string; price: number }> }>();
</script>

<style lang="scss" scoped>
.shop-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.shop-header {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffcc80;
  margin-bottom: 10px;
  text-align: center;
}

.shop-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.shop-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 4px 0;
  border-bottom: 1px dotted rgba(255, 255, 255, 0.08);
}

.shop-item-name {
  font-size: 0.9rem;
  color: #c0c0e0;
}

.shop-item-price {
  font-size: 0.88rem;
  color: #ffd54f;
  font-weight: 600;
  white-space: nowrap;
  margin-left: 12px;
}

.shop-footer {
  text-align: center;
  color: #555577;
  font-size: 0.8rem;
  margin-top: 6px;
}
</style>
