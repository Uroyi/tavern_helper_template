<template>
  <div class="spank-card">
    <div class="spank-header">👋 打屁股结算</div>

    <div class="spank-main">
      <div class="spank-count">
        <span class="spank-num">{{ count }}</span>
        <span class="spank-unit">下</span>
      </div>
      <div class="spank-divider" />
      <div class="spank-info">
        <div class="spank-row">
          <span class="spank-label">回合</span>
          <span class="spank-value">第 {{ round }} 轮</span>
        </div>
        <div class="spank-row">
          <span class="spank-label">工具</span>
          <span class="spank-value tool">{{ tool }}</span>
        </div>
      </div>
    </div>

    <div class="spank-status">
      <div class="status-item">
        <div class="status-swatch" :style="{ background: colorHex }"></div>
        <div class="status-body">
          <span class="status-label">臀部颜色</span>
          <span class="status-value" :style="{ color: colorHex }">{{ color }}</span>
        </div>
      </div>
      <div class="status-item">
        <div class="status-icon">{{ tempIcon }}</div>
        <div class="status-body">
          <span class="status-label">体感温度</span>
          <span class="status-value temp">{{ temperature }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  round: string;
  count: string;
  tool: string;
  color: string;
  temperature: string;
}>();

const colorHex = computed(() => {
  const c = props.color;
  if (c.includes('红') || c.includes('深')) return '#ef5350';
  if (c.includes('粉')) return '#f48fb1';
  if (c.includes('紫') || c.includes('青')) return '#ce93d8';
  if (c.includes('白') || c.includes('正常')) return '#ffe0b2';
  return '#ff8a80';
});

const tempIcon = computed(() => {
  const t = props.temperature;
  if (t.includes('滚烫') || t.includes('火辣')) return '🔥';
  if (t.includes('热') || t.includes('发烫')) return '🌡️';
  if (t.includes('温') || t.includes('暖')) return '♨️';
  if (t.includes('凉') || t.includes('微')) return '💨';
  return '🌡️';
});
</script>

<style lang="scss" scoped>
.spank-card {
  background: linear-gradient(135deg, rgba(255, 120, 100, 0.08), rgba(255, 60, 60, 0.04));
  border: 1px solid rgba(239, 83, 80, 0.25);
  border-radius: 12px;
  padding: 16px 18px;
  margin: 12px 0;
}

.spank-header {
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  color: #ff8a80;
  margin-bottom: 14px;
  letter-spacing: 1px;
}

.spank-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 14px;
}

.spank-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.spank-num {
  font-size: 2.8rem;
  font-weight: 800;
  color: #ef5350;
  line-height: 1;
}

.spank-unit {
  font-size: 1rem;
  color: #ff8a80;
  font-weight: 600;
}

.spank-divider {
  width: 1px;
  height: 48px;
  background: rgba(239, 83, 80, 0.2);
  flex-shrink: 0;
}

.spank-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spank-label {
  font-size: 0.82rem;
  color: #8888aa;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.spank-value {
  font-size: 0.95rem;
  color: #d0d0e0;
  font-weight: 600;

  &.tool {
    color: #ffcc80;
  }
}

.spank-status {
  display: flex;
  gap: 12px;
}

.status-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 10px 12px;
}

.status-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.status-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
}

.status-body {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 0.75rem;
  color: #7777aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 0.95rem;
  font-weight: 600;

  &.temp {
    color: #ffab91;
  }
}
</style>
