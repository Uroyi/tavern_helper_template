<template>
  <div class="character-panel">
    <div v-for="char in characters" :key="char.key" class="char-card" :class="{ 'char-unknown': !char.met, 'char-present': char.present }">
      <!-- Header -->
      <div class="char-header">
        <div class="char-name-row">
          <span class="char-name">{{ char.met ? char.label : '???' }}</span>
          <span v-if="char.present" class="presence-dot" title="在场">●</span>
        </div>
        <span class="char-role">{{ char.met ? char.role : '' }}</span>
      </div>

      <!-- Affection -->
      <div class="affection-section">
        <div class="affection-header">
          <span class="aff-label">♥ 好感</span>
          <span class="aff-value" :style="{ color: affectionColor(char.affection) }">{{ char.affection }}</span>
        </div>
        <div class="affection-bar">
          <div
            class="affection-fill"
            :style="{ width: char.affection + '%', background: affectionColor(char.affection) }"
          ></div>
        </div>
      </div>

      <!-- Butt Status -->
      <div class="butt-section">
        <div class="butt-header">
          <span class="butt-label">🍑 臀部</span>
          <span v-if="char.effectiveRedness > 0" class="butt-value" :style="{ color: rednessColor(char.effectiveRedness) }">
            {{ rednessLabel(char.effectiveRedness) }}
          </span>
          <span v-else class="butt-normal">正常</span>
        </div>
        <div class="butt-bar-track">
          <div
            class="butt-bar-fill"
            :style="{ width: (char.effectiveRedness / 10) + '%', background: rednessGradient(char.effectiveRedness) }"
          ></div>
        </div>
      </div>

      <!-- SQ Progress -->
      <div class="sq-section">
        <span class="sq-label">SQ</span>
        <div class="sq-badges">
          <template v-for="(done, sq) in char.sq" :key="sq">
            <span :class="['sq-badge', done ? 'sq-done' : 'sq-pending']">
              {{ done ? '✓' : '○' }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';
import { DECAY_RATE_PER_HOUR } from '../constants';

const store = useDataStore();
const presence = computed(() => store.data.世界.角色出场状态);

function getEffectiveRedness(charKey: string): number {
  const c = (store.data as any)[charKey];
  if (!c?.臀部状态) return 0;
  const stored = c.臀部状态.红肿度 || 0;
  const lastUpdate = c.臀部状态.最近更新时间 || 0;
  if (stored <= 0) return 0;
  if (!lastUpdate || lastUpdate === 0) return stored;
  const hoursElapsed = (Date.now() - lastUpdate) / (1000 * 60 * 60);
  return Math.max(0, Math.round(stored - DECAY_RATE_PER_HOUR * hoursElapsed));
}

interface CharDisplay {
  key: string; label: string; role: string;
  affection: number; sq: Record<string, boolean>;
  met: boolean; present: boolean;
  effectiveRedness: number;
}

const characters = computed<CharDisplay[]>(() => [
  {
    key: '菲尔', label: '菲尔', role: '奴隶/旅伴',
    affection: store.data.菲尔.好感度, sq: store.data.菲尔.支线完成,
    met: presence.value['菲尔']?.已认识 ?? true,
    present: presence.value['菲尔']?.在场 ?? true,
    effectiveRedness: getEffectiveRedness('菲尔'),
  },
  {
    key: '艾莉西亚', label: '艾莉西亚', role: '贵族少女',
    affection: store.data.艾莉西亚.好感度, sq: store.data.艾莉西亚.支线完成,
    met: presence.value['艾莉西亚']?.已认识 ?? false,
    present: presence.value['艾莉西亚']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('艾莉西亚'),
  },
  {
    key: '赛拉', label: '赛拉', role: '贵族侍从',
    affection: store.data.赛拉.好感度, sq: store.data.赛拉.支线完成,
    met: presence.value['赛拉']?.已认识 ?? false,
    present: presence.value['赛拉']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('赛拉'),
  },
  {
    key: '米莉', label: '米莉', role: '工会接待员',
    affection: store.data.米莉.好感度, sq: store.data.米莉.支线完成,
    met: presence.value['米莉']?.已认识 ?? false,
    present: presence.value['米莉']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('米莉'),
  },
  {
    key: '艾琳', label: '艾琳', role: '酒馆女儿',
    affection: store.data.艾琳.好感度, sq: store.data.艾琳.支线完成,
    met: presence.value['艾琳']?.已认识 ?? false,
    present: presence.value['艾琳']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('艾琳'),
  },
  {
    key: '露露拉拉', label: '露露&拉拉', role: '旅店姐妹',
    affection: store.data.露露拉拉.好感度, sq: store.data.露露拉拉.支线完成,
    met: presence.value['露露']?.已认识 || presence.value['拉拉']?.已认识 || false,
    present: presence.value['露露']?.在场 || presence.value['拉拉']?.在场 || false,
    effectiveRedness: Math.max(getEffectiveRedness('露露拉拉'), 0),
  },
  {
    key: '哈尼', label: '哈尼', role: '商店店主',
    affection: store.data.哈尼.好感度, sq: store.data.哈尼.支线完成,
    met: presence.value['哈尼']?.已认识 ?? false,
    present: presence.value['哈尼']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('哈尼'),
  },
  {
    key: '玛丽亚', label: '玛丽亚', role: '教会修女',
    affection: store.data.玛丽亚.好感度, sq: store.data.玛丽亚.支线完成,
    met: presence.value['玛丽亚']?.已认识 ?? false,
    present: presence.value['玛丽亚']?.在场 ?? false,
    effectiveRedness: getEffectiveRedness('玛丽亚'),
  },
]);

const affectionColor = (val: number) => {
  if (val <= 0) return 'var(--affection-0)';
  if (val <= 30) return 'var(--affection-low)';
  if (val <= 60) return 'var(--affection-mid)';
  if (val <= 80) return 'var(--affection-high)';
  return 'var(--affection-max)';
};

const rednessLabel = (val: number) => {
  if (val <= 0) return '正常';
  if (val <= 29) return '光洁腻理';
  if (val <= 89) return '桃霞微粉';
  if (val <= 149) return '通体粉红';
  if (val <= 249) return '胭脂浅痕';
  if (val <= 399) return '丹红蒸腾';
  if (val <= 549) return '殷红发亮';
  if (val <= 699) return '红透欲滴';
  if (val <= 849) return '浓艳深红';
  if (val <= 949) return '绯紫交织';
  return '娇艳发紫';
};

const rednessColor = (val: number) => {
  if (val <= 0) return 'var(--text-muted)';
  if (val <= 89) return 'var(--accent-pink)';
  if (val <= 249) return '#f48fb1';
  if (val <= 399) return 'var(--accent-orange)';
  if (val <= 549) return 'var(--accent-red)';
  if (val <= 849) return '#d32f2f';
  return 'var(--accent-purple)';
};

const rednessGradient = (val: number) => {
  if (val <= 0) return 'var(--text-muted)';
  if (val <= 149) return 'linear-gradient(90deg, var(--accent-pink), #f48fb1)';
  if (val <= 399) return 'linear-gradient(90deg, #f48fb1, var(--accent-red))';
  return 'linear-gradient(90deg, var(--accent-red), var(--accent-purple))';
};
</script>

<style lang="scss" scoped>
.character-panel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 2px;
}

.char-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.2s;

  &:hover {
    background: var(--hover-bg);
  }

  &.char-present {
    border-color: rgba(129, 199, 132, 0.3);
  }

  &.char-unknown {
    opacity: 0.4;
  }
}

// Header
.char-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.char-name-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.char-name {
  font-size: 13px;
  font-weight: bold;
  color: var(--text-primary);
}

.presence-dot {
  color: var(--accent-green);
  font-size: 7px;
  line-height: 1;
}

.char-role {
  font-size: 10px;
  color: var(--text-muted);
}

// Affection
.affection-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.affection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.aff-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.aff-value {
  font-size: 14px;
  font-weight: 800;
}

.affection-bar {
  height: 5px;
  background: var(--bg-elevated);
  border-radius: 3px;
  overflow: hidden;
}

.affection-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

// Butt Status
.butt-section {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.butt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.butt-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.butt-value {
  font-size: 11px;
  font-weight: 700;
}

.butt-normal {
  font-size: 11px;
  color: var(--text-muted);
}

.butt-bar-track {
  height: 3px;
  background: var(--bg-elevated);
  border-radius: 2px;
  overflow: hidden;
}

.butt-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s linear;
}

// SQ Section
.sq-section {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sq-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
}

.sq-badges {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.sq-badge {
  font-size: 11px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 700;

  &.sq-done {
    background: rgba(129, 199, 132, 0.15);
    color: var(--accent-green);
  }

  &.sq-pending {
    background: rgba(85, 85, 119, 0.15);
    color: var(--text-muted);
  }
}
</style>
