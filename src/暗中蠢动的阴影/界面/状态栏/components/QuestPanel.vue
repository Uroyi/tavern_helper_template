<template>
  <div class="quest-panel">
    <div class="section">
      <div class="section-title">📍 当前状态</div>
      <div class="info-row">
        <span class="label">章节</span>
        <span class="value">{{ chapterName }}</span>
      </div>
      <div class="info-row">
        <span class="label">地点</span>
        <span class="value">{{ store.data.世界.当前地点 }}</span>
      </div>
      <div class="info-row">
        <span class="label">时间</span>
        <span class="value">{{ store.data.世界.当前时间 }}</span>
      </div>
      <div v-if="store.data.主线.路线 !== '未选择'" class="info-row">
        <span class="label">路线</span>
        <span class="value" :class="store.data.主线.路线 === '救赎' ? 'route-a' : 'route-b'">
          {{ store.data.主线.路线 === '救赎' ? '救赎之路' : '制裁之路' }}
        </span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">📋 活跃事务</div>
      <div v-if="taskEntries.length === 0" class="empty">暂无活跃事务</div>
      <div v-for="[name, desc] in taskEntries" :key="name" class="task-item">
        <div class="task-name">{{ name }}</div>
        <div class="task-desc">{{ desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();

const chapterNames: Record<number, string> = {
  0: '序章', 1: '第一章 · 边境之风', 2: '第二章 · 暗流涌动',
  3: '第三章 · 罗森堡的阴影', 4: '第四章',
};

const chapterName = computed(() => {
  const ch = store.data.主线.章节;
  let name = chapterNames[ch] || `第${ch}章`;
  if (ch === 4) {
    name += store.data.主线.路线 === '救赎' ? 'A · 救赎之路' : 'B · 制裁之路';
  }
  return name;
});

const taskEntries = computed(() => Object.entries(store.data.世界.近期事务));
</script>

<style lang="scss" scoped>
.quest-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section {
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  padding: 10px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #ffcc80;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 12px;

  .label { color: #8888aa; }
  .value { color: #d0d0e0; }
  .route-a { color: #81c784; }
  .route-b { color: #ef5350; }
}

.empty {
  color: #666688;
  font-style: italic;
  font-size: 12px;
}

.task-item {
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  .task-name { font-size: 12px; color: #c0c0e0; }
  .task-desc { font-size: 11px; color: #8888aa; }
}
</style>
