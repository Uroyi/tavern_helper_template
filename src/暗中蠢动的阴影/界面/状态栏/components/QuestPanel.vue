<template>
  <div class="quest-panel">
    <!-- Section 1: Current Status -->
    <div class="section">
      <div class="section-title">📍 当前状态</div>
      <div class="info-grid">
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
            {{ store.data.主线.路线 === '救赎' ? '✨ 救赎之路' : '⚔️ 制裁之路' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Section 2: Main Quest -->
    <div class="section" v-if="mainQuestName">
      <div class="section-title">🎯 当前主线任务</div>
      <div class="main-quest-card">
        <div class="mq-name">{{ mainQuestName }}</div>
        <div class="mq-detail" v-if="store.data.主线.主线任务详情">
          详情：{{ store.data.主线.主线任务详情 }}
        </div>
      </div>
    </div>

    <!-- Section 3: Main Quest Objectives (was 活跃事务) -->
    <div class="section">
      <div class="section-title">📋 主线目标</div>
      <div v-if="taskEntries.length === 0" class="empty">暂无主线目标</div>
      <div v-for="[name, desc] in taskEntries" :key="name" class="task-item">
        <div class="task-name">{{ name }}</div>
        <div class="task-desc">{{ desc }}</div>
      </div>
    </div>

    <!-- Section 4: Side Quests -->
    <div class="section">
      <div class="section-title">📌 支线任务</div>

      <div v-if="availableSQs.length === 0 && unavailableSQs.length === 0" class="empty">
        暂无支线任务
      </div>

      <template v-else>
        <!-- SQ Tabs -->
        <div class="sq-tabs">
          <button
            :class="['sq-tab', { active: sqTab === 'available' }]"
            @click="sqTab = 'available'"
          >
            ✅ 可用 <span class="sq-tab-count">{{ availableSQs.length }}</span>
          </button>
          <button
            :class="['sq-tab', { active: sqTab === 'unavailable' }]"
            @click="sqTab = 'unavailable'"
          >
            🔒 不可用 <span class="sq-tab-count">{{ unavailableSQs.length }}</span>
          </button>
        </div>

        <!-- Available Grid -->
        <div v-if="sqTab === 'available'" class="sq-grid">
          <div v-for="sq in availableSQs" :key="sq.id" class="sq-card sq-available">
            <div class="sq-header">
              <span class="sq-char" :style="{ color: sq.charMet ? sq.color : 'var(--text-muted)' }">{{ sq.charMet ? sq.charName : '???' }}</span>
              <span class="sq-id">{{ sq.sqId }}</span>
            </div>
            <div class="sq-title">{{ sq.charMet ? sq.title : '???' }}</div>
            <div class="sq-conds">
              <div v-for="cond in sq.conditions" :key="cond.text" class="sq-cond">
                <span :class="cond.met ? 'cond-met' : 'cond-fail'">{{ cond.met ? '✓' : '✗' }}</span>
                {{ cond.text }}
              </div>
            </div>
            <div class="sq-status">
              <span class="badge-ready">✅ 可触发</span>
            </div>
          </div>
        </div>

        <!-- Unavailable Grid -->
        <div v-if="sqTab === 'unavailable'" class="sq-grid">
          <div
            v-for="sq in unavailableSQs"
            :key="sq.id"
            class="sq-card"
            :class="{ 'sq-done': sq.completed }"
          >
            <div class="sq-header">
              <span class="sq-char" :style="{ color: sq.charMet ? sq.color : 'var(--text-muted)' }">{{ sq.charMet ? sq.charName : '???' }}</span>
              <span class="sq-id">{{ sq.sqId }}</span>
            </div>
            <div class="sq-title">{{ sq.charMet ? sq.title : '???' }}</div>
            <div v-if="sq.charMet" class="sq-conds">
              <div v-for="cond in sq.conditions" :key="cond.text" class="sq-cond">
                <span :class="cond.met ? 'cond-met' : 'cond-fail'">{{ cond.met ? '✓' : '✗' }}</span>
                {{ cond.text }}
              </div>
            </div>
            <div class="sq-status">
              <span v-if="sq.completed" class="badge-done">✅ 已完成</span>
              <span v-else class="badge-lock">🔒 条件未达成</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from '../store';

const store = useDataStore();
const sqTab = ref<string>('available');

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

const mainQuestName = computed(() => store.data.主线.当前主线任务 || '');

const taskEntries = computed(() => Object.entries(store.data.世界.近期事务));

// ---- Side Quest Definitions ----

const CHAR_COLORS: Record<string, string> = {
  '菲尔': '#ef5350', '艾莉西亚': '#ffb74d', '赛拉': '#90caf9',
  '米莉': '#81c784', '艾琳': '#ce93d8', '露露&拉拉': '#ff8a80',
  '哈尼': '#ffcc80', '玛丽亚': '#e0e0e0',
};

interface Cond { text: string; met: boolean }

interface SideQuestDisplay {
  id: string; charName: string; sqId: string; title: string;
  color: string; conditions: Cond[]; allMet: boolean; completed: boolean;
  charMet: boolean;
}

const sideQuestList = computed<SideQuestDisplay[]>(() => {
  const d = store.data;
  const p = d.世界.角色出场状态;
  const met = (name: string) => p[name]?.已认识 ?? false;
  const result: SideQuestDisplay[] = [];

  // 菲尔 SQ1
  result.push({
    id: 'fe-sq1', charName: '菲尔', sqId: '支线I', title: '旅店日记',
    color: CHAR_COLORS['菲尔'],
    conditions: [
      { text: '已认识菲尔', met: met('菲尔') },
      { text: '好感度 ≥ 30', met: d.菲尔.好感度 >= 30 },
    ],
    allMet: met('菲尔') && d.菲尔.好感度 >= 30,
    completed: d.菲尔.支线完成.SQ1,
    charMet: met('菲尔'),
  });
  // 菲尔 SQ2
  result.push({
    id: 'fe-sq2', charName: '菲尔', sqId: '支线II', title: '秘密特训',
    color: CHAR_COLORS['菲尔'],
    conditions: [
      { text: '已完成 SQ1', met: d.菲尔.支线完成.SQ1 },
      { text: '主线章节 ≥ 2', met: d.主线.章节 >= 2 },
      { text: '好感度 ≥ 50', met: d.菲尔.好感度 >= 50 },
    ],
    allMet: d.菲尔.支线完成.SQ1 && d.主线.章节 >= 2 && d.菲尔.好感度 >= 50,
    completed: d.菲尔.支线完成.SQ2,
    charMet: met('菲尔'),
  });
  // 菲尔 SQ3
  result.push({
    id: 'fe-sq3', charName: '菲尔', sqId: '支线III', title: '生日',
    color: CHAR_COLORS['菲尔'],
    conditions: [
      { text: '已完成 SQ1+SQ2', met: d.菲尔.支线完成.SQ1 && d.菲尔.支线完成.SQ2 },
      { text: '好感度 ≥ 80', met: d.菲尔.好感度 >= 80 },
    ],
    allMet: d.菲尔.支线完成.SQ1 && d.菲尔.支线完成.SQ2 && d.菲尔.好感度 >= 80,
    completed: d.菲尔.支线完成.SQ3,
    charMet: met('菲尔'),
  });

  // 艾莉西亚 SQ1
  result.push({
    id: 'al-sq1', charName: '艾莉西亚', sqId: '支线I', title: '夜间慈善',
    color: CHAR_COLORS['艾莉西亚'],
    conditions: [
      { text: '已认识艾莉西亚', met: met('艾莉西亚') },
      { text: '城门见过艾莉西亚', met: d.主线.关键flag.见过艾莉西亚城门出场 },
      { text: '地点为罗森堡旧宅', met: d.世界.当前地点 === '罗森堡旧宅' },
    ],
    allMet: met('艾莉西亚') && d.主线.关键flag.见过艾莉西亚城门出场 && d.世界.当前地点 === '罗森堡旧宅',
    completed: d.艾莉西亚.支线完成.SQ1,
    charMet: met('艾莉西亚'),
  });
  // 艾莉西亚 SQ2
  result.push({
    id: 'al-sq2', charName: '艾莉西亚', sqId: '支线II', title: '赛拉的药水',
    color: CHAR_COLORS['艾莉西亚'],
    conditions: [
      { text: '已完成 SQ1', met: d.艾莉西亚.支线完成.SQ1 },
    ],
    allMet: d.艾莉西亚.支线完成.SQ1,
    completed: d.艾莉西亚.支线完成.SQ2,
    charMet: met('艾莉西亚'),
  });
  // 艾莉西亚 SQ3
  result.push({
    id: 'al-sq3', charName: '艾莉西亚', sqId: '支线III', title: '独白祈祷',
    color: CHAR_COLORS['艾莉西亚'],
    conditions: [
      { text: '已完成 SQ2', met: d.艾莉西亚.支线完成.SQ2 },
    ],
    allMet: d.艾莉西亚.支线完成.SQ2,
    completed: d.艾莉西亚.支线完成.SQ3,
    charMet: met('艾莉西亚'),
  });
  // 艾莉西亚 SQ4
  result.push({
    id: 'al-sq4', charName: '艾莉西亚', sqId: '支线IV', title: '公开道歉',
    color: CHAR_COLORS['艾莉西亚'],
    conditions: [
      { text: '已完成 SQ3', met: d.艾莉西亚.支线完成.SQ3 },
      { text: '救赎路线结局后', met: d.主线.第四章_完成 && d.主线.路线 === '救赎' },
    ],
    allMet: d.艾莉西亚.支线完成.SQ3 && d.主线.第四章_完成 && d.主线.路线 === '救赎',
    completed: d.艾莉西亚.支线完成.SQ4,
    charMet: met('艾莉西亚'),
  });

  // 赛拉 SQ1
  result.push({
    id: 'se-sq1', charName: '赛拉', sqId: '支线I', title: '下水道再会',
    color: CHAR_COLORS['赛拉'],
    conditions: [
      { text: '已认识赛拉', met: met('赛拉') },
      { text: '下水道交手后', met: d.赛拉.专属flag.下水道初次交手 },
    ],
    allMet: met('赛拉') && d.赛拉.专属flag.下水道初次交手,
    completed: d.赛拉.支线完成.SQ1,
    charMet: met('赛拉'),
  });
  // 赛拉 SQ2 (救赎路线)
  result.push({
    id: 'se-sq2', charName: '赛拉', sqId: '支线II', title: '木剑训练',
    color: CHAR_COLORS['赛拉'],
    conditions: [
      { text: '已完成 SQ1', met: d.赛拉.支线完成.SQ1 },
      { text: '救赎路线', met: d.主线.路线 === '救赎' },
    ],
    allMet: d.赛拉.支线完成.SQ1 && d.主线.路线 === '救赎',
    completed: d.赛拉.支线完成.SQ2,
    charMet: met('赛拉'),
  });
  // 赛拉 SQ3 (制裁路线)
  result.push({
    id: 'se-sq3', charName: '赛拉', sqId: '支线III', title: '断绝关系',
    color: CHAR_COLORS['赛拉'],
    conditions: [
      { text: '已完成 SQ1', met: d.赛拉.支线完成.SQ1 },
      { text: '制裁路线', met: d.主线.路线 === '制裁' },
    ],
    allMet: d.赛拉.支线完成.SQ1 && d.主线.路线 === '制裁',
    completed: d.赛拉.支线完成.SQ3,
    charMet: met('赛拉'),
  });
  // 赛拉 SQ4 (救赎路线)
  result.push({
    id: 'se-sq4', charName: '赛拉', sqId: '支线IV', title: '工会教官',
    color: CHAR_COLORS['赛拉'],
    conditions: [
      { text: '已完成 SQ1+SQ2', met: d.赛拉.支线完成.SQ1 && d.赛拉.支线完成.SQ2 },
      { text: '救赎路线', met: d.主线.路线 === '救赎' },
    ],
    allMet: d.赛拉.支线完成.SQ1 && d.赛拉.支线完成.SQ2 && d.主线.路线 === '救赎',
    completed: d.赛拉.支线完成.SQ4,
    charMet: met('赛拉'),
  });

  // 米莉 SQ1
  result.push({
    id: 'mi-sq1', charName: '米莉', sqId: '支线I', title: '隐秘坦白',
    color: CHAR_COLORS['米莉'],
    conditions: [
      { text: '已认识米莉', met: met('米莉') },
      { text: '好感度 ≥ 10', met: d.米莉.好感度 >= 10 },
      { text: '菲尔被打过屁股', met: d.主角.打屁股统计.菲尔 > 0 },
    ],
    allMet: met('米莉') && d.米莉.好感度 >= 10 && d.主角.打屁股统计.菲尔 > 0,
    completed: d.米莉.支线完成.SQ1,
    charMet: met('米莉'),
  });
  // 米莉 SQ2
  result.push({
    id: 'mi-sq2', charName: '米莉', sqId: '支线II', title: '情报网',
    color: CHAR_COLORS['米莉'],
    conditions: [
      { text: '已完成 SQ1', met: d.米莉.支线完成.SQ1 },
    ],
    allMet: d.米莉.支线完成.SQ1,
    completed: d.米莉.支线完成.SQ2,
    charMet: met('米莉'),
  });
  // 米莉 SQ3
  result.push({
    id: 'mi-sq3', charName: '米莉', sqId: '支线III', title: '大冒险',
    color: CHAR_COLORS['米莉'],
    conditions: [
      { text: '已完成 SQ2', met: d.米莉.支线完成.SQ2 },
      { text: '章节 ≥ 3', met: d.主线.章节 >= 3 },
    ],
    allMet: d.米莉.支线完成.SQ2 && d.主线.章节 >= 3,
    completed: d.米莉.支线完成.SQ3,
    charMet: met('米莉'),
  });

  // 艾琳 SQ1
  result.push({
    id: 'ei-sq1', charName: '艾琳', sqId: '支线I', title: '帮忙看店',
    color: CHAR_COLORS['艾琳'],
    conditions: [
      { text: '已认识艾琳', met: met('艾琳') },
      { text: '好感度 ≥ 5', met: d.艾琳.好感度 >= 5 },
    ],
    allMet: met('艾琳') && d.艾琳.好感度 >= 5,
    completed: d.艾琳.支线完成.SQ1,
    charMet: met('艾琳'),
  });
  // 艾琳 SQ2
  result.push({
    id: 'ei-sq2', charName: '艾琳', sqId: '支线II', title: '离家出走',
    color: CHAR_COLORS['艾琳'],
    conditions: [
      { text: '已完成 SQ1', met: d.艾琳.支线完成.SQ1 },
    ],
    allMet: d.艾琳.支线完成.SQ1,
    completed: d.艾琳.支线完成.SQ2,
    charMet: met('艾琳'),
  });
  // 艾琳 SQ3
  result.push({
    id: 'ei-sq3', charName: '艾琳', sqId: '支线III', title: '独家情报',
    color: CHAR_COLORS['艾琳'],
    conditions: [
      { text: '已完成 SQ2', met: d.艾琳.支线完成.SQ2 },
      { text: '米莉 SQ2 完成', met: d.米莉.支线完成.SQ2 },
    ],
    allMet: d.艾琳.支线完成.SQ2 && d.米莉.支线完成.SQ2,
    completed: d.艾琳.支线完成.SQ3,
    charMet: met('艾琳'),
  });

  // 露露拉拉 SQ1
  const metTwins = met('露露') || met('拉拉');
  result.push({
    id: 'll-sq1', charName: '露露&拉拉', sqId: '支线I', title: '姐妹争吵',
    color: CHAR_COLORS['露露&拉拉'],
    conditions: [
      { text: '已认识姐妹之一', met: metTwins },
      { text: '好感度 ≥ 5', met: d.露露拉拉.好感度 >= 5 },
    ],
    allMet: metTwins && d.露露拉拉.好感度 >= 5,
    completed: d.露露拉拉.支线完成.SQ1,
    charMet: metTwins,
  });
  // 露露拉拉 SQ2
  result.push({
    id: 'll-sq2', charName: '露露&拉拉', sqId: '支线II', title: '选择帮助一方',
    color: CHAR_COLORS['露露&拉拉'],
    conditions: [
      { text: '已完成 SQ1', met: d.露露拉拉.支线完成.SQ1 },
    ],
    allMet: d.露露拉拉.支线完成.SQ1,
    completed: d.露露拉拉.支线完成.SQ2,
    charMet: metTwins,
  });
  // 露露拉拉 SQ3
  result.push({
    id: 'll-sq3', charName: '露露&拉拉', sqId: '支线III', title: '救援父亲',
    color: CHAR_COLORS['露露&拉拉'],
    conditions: [
      { text: '已完成 SQ2', met: d.露露拉拉.支线完成.SQ2 },
    ],
    allMet: d.露露拉拉.支线完成.SQ2,
    completed: d.露露拉拉.支线完成.SQ3,
    charMet: metTwins,
  });

  // 哈尼 SQ1
  result.push({
    id: 'ha-sq1', charName: '哈尼', sqId: '支线I', title: '热情欢迎',
    color: CHAR_COLORS['哈尼'],
    conditions: [
      { text: '已认识哈尼', met: met('哈尼') },
    ],
    allMet: met('哈尼'),
    completed: d.哈尼.支线完成.SQ1,
    charMet: met('哈尼'),
  });
  // 哈尼 SQ2
  result.push({
    id: 'ha-sq2', charName: '哈尼', sqId: '支线II', title: '消费达人',
    color: CHAR_COLORS['哈尼'],
    conditions: [
      { text: '已完成 SQ1', met: d.哈尼.支线完成.SQ1 },
      { text: '消费金额 ≥ 5000', met: d.哈尼.专属flag.消费金额 >= 5000 },
    ],
    allMet: d.哈尼.支线完成.SQ1 && d.哈尼.专属flag.消费金额 >= 5000,
    completed: d.哈尼.支线完成.SQ2,
    charMet: met('哈尼'),
  });
  // 哈尼 SQ3
  result.push({
    id: 'ha-sq3', charName: '哈尼', sqId: '支线III', title: '三百年故事',
    color: CHAR_COLORS['哈尼'],
    conditions: [
      { text: '已完成 SQ2', met: d.哈尼.支线完成.SQ2 },
    ],
    allMet: d.哈尼.支线完成.SQ2,
    completed: d.哈尼.支线完成.SQ3,
    charMet: met('哈尼'),
  });
  // 哈尼 SQ4
  const allOtherCharsComplete = ['菲尔','艾莉西亚','赛拉','米莉','艾琳','露露拉拉','玛丽亚'].every(c => {
    const sq = (d as any)[c]?.支线完成;
    return sq && Object.values(sq as Record<string,boolean>).every(v => v);
  });
  result.push({
    id: 'ha-sq4', charName: '哈尼', sqId: '支线IV', title: '真相之板',
    color: CHAR_COLORS['哈尼'],
    conditions: [
      { text: '已完成 SQ3', met: d.哈尼.支线完成.SQ3 },
      { text: '所有角色支线完成', met: allOtherCharsComplete },
    ],
    allMet: d.哈尼.支线完成.SQ3 && allOtherCharsComplete,
    completed: d.哈尼.支线完成.SQ4,
    charMet: met('哈尼'),
  });

  // 玛丽亚 SQ1
  result.push({
    id: 'mr-sq1', charName: '玛丽亚', sqId: '支线I', title: '废弃教会秘密',
    color: CHAR_COLORS['玛丽亚'],
    conditions: [
      { text: '已认识玛丽亚', met: met('玛丽亚') },
      { text: '好感度 ≥ 10', met: d.玛丽亚.好感度 >= 10 },
    ],
    allMet: met('玛丽亚') && d.玛丽亚.好感度 >= 10,
    completed: d.玛丽亚.支线完成.SQ1,
    charMet: met('玛丽亚'),
  });
  // 玛丽亚 SQ2
  result.push({
    id: 'mr-sq2', charName: '玛丽亚', sqId: '支线II', title: '考试',
    color: CHAR_COLORS['玛丽亚'],
    conditions: [
      { text: '已完成 SQ1', met: d.玛丽亚.支线完成.SQ1 },
    ],
    allMet: d.玛丽亚.支线完成.SQ1,
    completed: d.玛丽亚.支线完成.SQ2,
    charMet: met('玛丽亚'),
  });
  // 玛丽亚 SQ3
  result.push({
    id: 'mr-sq3', charName: '玛丽亚', sqId: '支线III', title: '瘟疫事件',
    color: CHAR_COLORS['玛丽亚'],
    conditions: [
      { text: '已完成 SQ2', met: d.玛丽亚.支线完成.SQ2 },
      { text: '章节 ≥ 3', met: d.主线.章节 >= 3 },
    ],
    allMet: d.玛丽亚.支线完成.SQ2 && d.主线.章节 >= 3,
    completed: d.玛丽亚.支线完成.SQ3,
    charMet: met('玛丽亚'),
  });

  return result;
});

const availableSQs = computed(() =>
  sideQuestList.value.filter(sq => sq.charMet && sq.allMet && !sq.completed)
);

const unavailableSQs = computed(() =>
  sideQuestList.value.filter(sq => !sq.charMet || !sq.allMet || sq.completed)
    .sort((a, b) => {
      // completed at bottom
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // charMet before !charMet
      if (a.charMet !== b.charMet) return a.charMet ? -1 : 1;
      return 0;
    })
);
</script>

<style lang="scss" scoped>
.quest-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 10px 12px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--accent-gold);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;

  .label { color: var(--text-secondary); }
  .value { color: var(--text-primary); }
  .route-a { color: var(--accent-green); font-weight: bold; }
  .route-b { color: var(--accent-red); font-weight: bold; }
}

// Main Quest
.main-quest-card {
  background: var(--bg-elevated);
  border-radius: 6px;
  padding: 10px;
  border-left: 3px solid var(--accent-gold);

  .mq-name {
    font-size: 13px;
    color: var(--accent-gold);
    font-weight: bold;
    margin-bottom: 4px;
  }
  .mq-detail {
    font-size: 11px;
    color: var(--text-primary);
    line-height: 1.5;
  }
}

// Main Quest Objectives
.empty {
  color: var(--text-muted);
  font-style: italic;
  font-size: 12px;
}

.task-item {
  padding: 5px 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  border-left: 3px solid var(--border-color);

  .task-name { font-size: 12px; color: var(--text-primary); font-weight: 600; }
  .task-desc { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
}

// Side Quest Tabs
.sq-tabs {
  display: flex;
  gap: 0;
  background: var(--bg-card);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.sq-tab {
  flex: 1;
  padding: 6px 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    color: var(--text-primary);
    background: var(--hover-bg);
  }

  &.active {
    color: var(--accent-gold);
    border-bottom-color: var(--accent-gold);
  }
}

.sq-tab-count {
  font-size: 10px;
  font-weight: 700;
  margin-left: 3px;

  .sq-tab.active & {
    color: var(--accent-gold);
  }
}

// Side Quest Grid
.sq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 2px;
}

.sq-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  padding: 7px 9px;
  transition: border-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &.sq-available {
    border-color: var(--accent-green);
  }

  &.sq-done {
    opacity: 0.5;
  }
}

.sq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sq-char {
  font-size: 12px;
  font-weight: bold;
}

.sq-id {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 600;
}

.sq-title {
  font-size: 11px;
  color: var(--text-primary);
}

.sq-conds {
  font-size: 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sq-cond {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 3px;

  .cond-met { color: var(--accent-green); }
  .cond-fail { color: var(--text-muted); }
}

.sq-status {
  margin-top: 2px;
  font-size: 10px;
  font-weight: 600;

  .badge-ready { color: var(--accent-green); }
  .badge-lock { color: var(--text-muted); }
  .badge-done { color: var(--accent-green); }
}
</style>
