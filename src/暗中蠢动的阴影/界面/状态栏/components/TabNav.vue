<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-btn', { active: modelValue === tab.id }]"
      @click="$emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string }[];
  modelValue: string | null;
}>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style lang="scss" scoped>
.tab-nav {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;

  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }

  &.active {
    color: var(--accent-gold);
    border-bottom-color: var(--accent-gold);
  }
}
</style>
