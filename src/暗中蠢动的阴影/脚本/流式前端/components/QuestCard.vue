<template>
  <div class="quest-card" :style="{ borderLeftColor: difficultyColor }">
    <div class="quest-header">
      <span class="quest-title">📜 {{ title }}</span>
      <span class="quest-badge" :style="{ background: difficultyColor }">
        {{ difficulty }}
      </span>
    </div>
    <div class="quest-reward">💰 报酬：{{ reward }}</div>
    <div class="quest-objective">{{ objective }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  difficulty: string;
  reward: string;
  objective: string;
}>();

const difficultyColor = computed(() => {
  switch (props.difficulty) {
    case '简单': return '#81c784';
    case '普通': return '#ffb74d';
    case '困难': return '#ef5350';
    default: return '#ffb74d';
  }
});
</script>

<style lang="scss" scoped>
.quest-card {
  background: rgba(255, 255, 255, 0.04);
  border-left: 3px solid #ffb74d;
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
}

.quest-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.quest-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #e0e0f0;
}

.quest-badge {
  display: inline-block;
  font-size: 0.75rem;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.quest-reward {
  font-size: 0.88rem;
  color: #ffd54f;
  margin-bottom: 6px;
}

.quest-objective {
  font-size: 0.9rem;
  color: #b0b0c8;
  line-height: 1.55;
}
</style>
