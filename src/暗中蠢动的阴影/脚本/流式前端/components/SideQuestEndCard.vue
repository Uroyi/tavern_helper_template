<template>
  <div class="sidequest-end-card">
    <div class="sqe-icon">✅</div>
    <div class="sqe-body">
      <div class="sqe-title">支线完成</div>
      <div class="sqe-badge" :style="{ background: accentColor + '22', borderColor: accentColor, color: accentColor }">
        <span class="sqe-char">{{ character }}</span>
        <span class="sqe-sep">·</span>
        <span class="sqe-sq">{{ sq }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  character: string;
  sq: string;
}>();

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

function hashColor(name: string): string {
  const colors = ['#ef5350', '#ffb74d', '#4dd0e1', '#81c784', '#ce93d8', '#ff8a65', '#64b5f6', '#a5d6a7'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

const accentColor = computed(() => colorPalette[props.character] ?? hashColor(props.character));
</script>

<style lang="scss" scoped>
.sidequest-end-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(129, 199, 132, 0.06);
  border: 1px solid rgba(129, 199, 132, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  margin: 10px 0;
}

.sqe-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  line-height: 1;
}

.sqe-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sqe-title {
  font-size: 0.78rem;
  color: #81c784;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sqe-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid;
  font-size: 0.9rem;
  font-weight: 700;
  align-self: flex-start;
}

.sqe-char {
  font-weight: 700;
}

.sqe-sep {
  opacity: 0.5;
}

.sqe-sq {
  font-weight: 600;
  opacity: 0.9;
}
</style>
