<template>
  <div class="choice-card">
    <div v-if="prompt" class="choice-prompt">{{ prompt }}</div>
    <div class="choice-list">
      <button
        v-for="(choice, i) in choices"
        :key="i"
        class="choice-btn"
        :class="{ selected: selectedIndex === i }"
        :disabled="disabled || selectedIndex !== null"
        @click="selectChoice(i)"
      >
        <span class="choice-num">{{ i + 1 }}</span>
        <span class="choice-text">{{ choice.text }}</span>
      </button>
    </div>
    <div v-if="selectedIndex !== null" class="choice-done">
      ✓ 已选择：{{ choices[selectedIndex].text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  prompt: string;
  choices: Array<{ text: string }>;
  disabled: boolean;
}>();

const selectedIndex = ref<number | null>(null);

async function selectChoice(index: number) {
  if (selectedIndex.value !== null || props.disabled) return;
  selectedIndex.value = index;
  await createChatMessages([{ role: 'user', message: props.choices[index].text }]);
  triggerSlash('/trigger');
}
</script>

<style lang="scss" scoped>
.choice-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 14px 16px;
  margin: 12px 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.choice-prompt {
  font-size: 0.95rem;
  color: #c0c0e0;
  font-style: italic;
  margin-bottom: 12px;
  line-height: 1.5;
}

.choice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choice-btn {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: #d0d0e0;
  font-size: 0.9rem;
  line-height: 1.45;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 204, 128, 0.3);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &.selected {
    border-color: #ffcc80;
    background: rgba(255, 204, 128, 0.12);
    opacity: 1;
  }
}

.choice-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.78rem;
  font-weight: 600;
  color: #ffcc80;
  flex-shrink: 0;
}

.choice-text {
  flex: 1;
}

.choice-done {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #81c784;
  font-weight: 600;
}
</style>
