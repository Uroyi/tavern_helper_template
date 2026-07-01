<template>
  <div class="location-card">
    <div class="location-icon">{{ icon }}</div>
    <div class="location-body">
      <div class="location-name">{{ name }}</div>
      <div class="location-desc">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ type: string; name: string; description: string }>();

const iconMap: Record<string, string> = {
  '工会': '🏛️',
  '酒馆': '🍺',
  '旅店': '🏨',
  '商店': '🛒',
  '教会': '⛪',
  '城门': '🏰',
  '下水道': '🏚️',
  '野外': '🌲',
};

const icon = computed(() => iconMap[props.type] ?? '📍');
</script>

<style lang="scss" scoped>
.location-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #ffb74d;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
}

.location-icon {
  font-size: 2.4rem;
  line-height: 1;
  flex-shrink: 0;
}

.location-body {
  flex: 1;
}

.location-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffcc80;
  margin-bottom: 4px;
}

.location-desc {
  font-size: 0.9rem;
  color: #b0b0c8;
  line-height: 1.55;
}
</style>
