<template>
  <div class="narrative-box">
    <div class="narrative-body" v-html="html" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ html: string }>();
</script>

<style lang="scss" scoped>
.narrative-box {
  margin: 6px 0;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-left: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 0 6px 6px 0;
}

.narrative-body {
  font-size: 0.92rem;
  color: #c8c8e0;
  line-height: 1.8;
  word-break: break-word;

  :deep(p) {
    margin: 0 0 0.6em;
    &:last-child { margin-bottom: 0; }
  }

  :deep(em) { color: #a0a0c0; }
  :deep(strong) { color: #e0e0f8; }
}
</style>
