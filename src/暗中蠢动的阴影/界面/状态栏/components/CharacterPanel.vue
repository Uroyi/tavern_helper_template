<template>
  <div class="character-panel">
    <div v-for="char in characters" :key="char.key" class="char-row" :class="{ 'char-unknown': !char.met }">
      <div class="char-header">
        <span class="char-name">{{ char.label }}</span>
        <span class="char-role">{{ char.role }}</span>
      </div>
      <div class="affection-bar">
        <div
          class="affection-fill"
          :style="{ width: char.affection + '%', background: affectionColor(char.affection) }"
        ></div>
      </div>
      <div class="char-meta">
        <span class="affection-text">好感 {{ char.affection }}</span>
        <span class="sq-status">
          SQ: <template v-for="(done, sq) in char.sq" :key="sq">
            <span :class="done ? 'sq-done' : 'sq-pending'">{{ sq }}</span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const presence = computed(() => store.data.世界.角色出场状态);

const characters = computed(() => [
  { key: '菲尔', label: '菲尔', role: '奴隶/旅伴',
    affection: store.data.菲尔.好感度, sq: store.data.菲尔.支线完成,
    met: presence.value['菲尔']?.已认识 ?? true },
  { key: '艾莉西亚', label: '艾莉西亚', role: '贵族少女',
    affection: store.data.艾莉西亚.好感度, sq: store.data.艾莉西亚.支线完成,
    met: presence.value['艾莉西亚']?.已认识 ?? false },
  { key: '赛拉', label: '赛拉', role: '贵族侍从',
    affection: store.data.赛拉.好感度, sq: store.data.赛拉.支线完成,
    met: presence.value['赛拉']?.已认识 ?? false },
  { key: '米莉', label: '米莉', role: '工会接待员',
    affection: store.data.米莉.好感度, sq: store.data.米莉.支线完成,
    met: presence.value['米莉']?.已认识 ?? false },
  { key: '艾琳', label: '艾琳', role: '酒馆女儿',
    affection: store.data.艾琳.好感度, sq: store.data.艾琳.支线完成,
    met: presence.value['艾琳']?.已认识 ?? false },
  { key: '露露拉拉', label: '露露&拉拉', role: '旅店姐妹',
    affection: store.data.露露拉拉.好感度, sq: store.data.露露拉拉.支线完成,
    met: presence.value['露露']?.已认识 || presence.value['拉拉']?.已认识 || false },
  { key: '哈尼', label: '哈尼', role: '商店店主',
    affection: store.data.哈尼.好感度, sq: store.data.哈尼.支线完成,
    met: presence.value['哈尼']?.已认识 ?? false },
  { key: '玛丽亚', label: '玛丽亚', role: '教会修女',
    affection: store.data.玛丽亚.好感度, sq: store.data.玛丽亚.支线完成,
    met: presence.value['玛丽亚']?.已认识 ?? false },
]);

const affectionColor = (val: number) => {
  if (val <= 0) return '#444466';
  if (val <= 30) return '#78909c';
  if (val <= 60) return '#81c784';
  if (val <= 80) return '#ffb74d';
  return '#ef5350';
};
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.char-row {
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  padding: 8px 10px;
}

.char-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  .char-name { font-size: 13px; color: #d0d0e0; font-weight: bold; }
  .char-role { font-size: 11px; color: #666688; }
}

.affection-bar {
  height: 4px;
  background: #2a2a4a;
  border-radius: 2px;
  overflow: hidden;
  margin: 4px 0;
}

.affection-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s;
}

.char-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;

  .affection-text { color: #8888aa; }
  .sq-status { color: #8888aa; }
  .sq-done { color: #81c784; margin-left: 2px; }
  .sq-pending { color: #555577; margin-left: 2px; }
}

.char-unknown {
  opacity: 0.4;
  .char-name { color: #555577; }
}
</style>
