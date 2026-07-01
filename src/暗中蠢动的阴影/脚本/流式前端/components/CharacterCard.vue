<template>
  <div class="character-card" :style="{ borderLeftColor: accentColor }">
    <div class="char-header">
      <div class="char-avatar" :style="{ background: accentColor }">
        {{ name.charAt(0) }}
      </div>
      <div class="char-info">
        <div class="char-name">{{ name }}</div>
        <div class="char-role">{{ role }}</div>
      </div>
    </div>
    <div class="char-desc">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ name: string; role: string; description: string }>();

const colorPalette: Record<string, string> = {
  '菲尔': '#ef5350',
  '艾莉西亚': '#ffb74d',
  '赛拉': '#4dd0e1',
  '米莉': '#81c784',
  '艾琳': '#ce93d8',
  '露露': '#ff8a65',
  '拉拉': '#ff8a65',
  '哈尼': '#64b5f6',
  '玛丽亚': '#a5d6a7',
};

// Simple hash fallback for unknown names
function hashColor(name: string): string {
  const colors = ['#ef5350', '#ffb74d', '#4dd0e1', '#81c784', '#ce93d8', '#ff8a65', '#64b5f6', '#a5d6a7'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

const accentColor = computed(() => colorPalette[props.name] ?? hashColor(props.name));
</script>

<style lang="scss" scoped>
.character-card {
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #888;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
}

.char-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.char-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.char-info {
  flex: 1;
}

.char-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #e0e0f0;
}

.char-role {
  font-size: 0.82rem;
  color: #8888aa;
}

.char-desc {
  font-size: 0.9rem;
  color: #b0b0c8;
  line-height: 1.55;
}
</style>
