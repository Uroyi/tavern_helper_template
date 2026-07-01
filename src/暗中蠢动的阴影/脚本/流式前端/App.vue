<template>
  <div class="streaming-wrapper">
    <div v-if="before_html" v-html="before_html" />
    <LocationCard v-if="locationData" v-bind="locationData" />
    <CharacterCard v-if="characterData" v-bind="characterData" />
    <ShopMenuCard v-if="shopData" v-bind="shopData" />
    <ChoiceCard
      v-if="choiceData"
      v-bind="choiceData"
      :disabled="context.during_streaming"
    />
    <QuestCard v-if="questData" v-bind="questData" />
    <SpankCard v-if="spankData" v-bind="spankData" />
    <div v-if="after_html" v-html="after_html" />
    <!-- Fallback: no tags detected, render full message -->
    <div v-if="!hasAnyCard && context.message" v-html="full_html" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { injectStreamingMessageContext } from '@util/streaming';
import LocationCard from './components/LocationCard.vue';
import CharacterCard from './components/CharacterCard.vue';
import ShopMenuCard from './components/ShopMenuCard.vue';
import ChoiceCard from './components/ChoiceCard.vue';
import QuestCard from './components/QuestCard.vue';
import SpankCard from './components/SpankCard.vue';

const context = injectStreamingMessageContext();

// ── Location card ──────────────────────────────────────────────
const locStart = computed(() => context.message.lastIndexOf('<location_card'));
const locEnd = computed(() => {
  const s = locStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</location_card>', s);
});

const locationData = computed(() => {
  if (locStart.value === -1) return null;
  const end = locEnd.value;
  const block = end === -1
    ? context.message.slice(locStart.value)
    : context.message.slice(locStart.value, end + 16);
  const type = block.match(/type="(\S+?)"/)?.[1] ?? '';
  const name = block.match(/<name>(.*?)<\/name>/s)?.[1]?.trim() ?? '';
  const description = block.match(/<description>(.*?)<\/description>/s)?.[1]?.trim() ?? '';
  if (!name && !description) return null;
  return { type, name, description };
});

// ── Character card ─────────────────────────────────────────────
const charStart = computed(() => context.message.lastIndexOf('<character_card'));
const charEnd = computed(() => {
  const s = charStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</character_card>', s);
});

const characterData = computed(() => {
  if (charStart.value === -1) return null;
  const end = charEnd.value;
  const block = end === -1
    ? context.message.slice(charStart.value)
    : context.message.slice(charStart.value, end + 17);
  const name = block.match(/name="(\S+?)"/)?.[1] ?? '';
  const role = block.match(/<role>(.*?)<\/role>/s)?.[1]?.trim() ?? '';
  const description = block.match(/<description>(.*?)<\/description>/s)?.[1]?.trim() ?? '';
  if (!name) return null;
  return { name, role, description };
});

// ── Shop menu ──────────────────────────────────────────────────
const shopStart = computed(() => context.message.lastIndexOf('<shop_menu'));
const shopEnd = computed(() => {
  const s = shopStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</shop_menu>', s);
});

const shopData = computed(() => {
  if (shopStart.value === -1) return null;
  const end = shopEnd.value;
  const block = end === -1
    ? context.message.slice(shopStart.value)
    : context.message.slice(shopStart.value, end + 12);
  const name = block.match(/name="(\S+?)"/)?.[1] ?? '';
  const itemMatches = [...block.matchAll(/<item price="(\d+)">(.*?)<\/item>/gs)];
  const items = itemMatches.map(m => ({
    text: m[2].trim(),
    price: Number(m[1]),
  }));
  if (!name && items.length === 0) return null;
  return { name, items };
});

// ── Choices ────────────────────────────────────────────────────
const choiceStart = computed(() => context.message.lastIndexOf('<choices'));
const choiceEnd = computed(() => {
  const s = choiceStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</choices>', s);
});

const choiceData = computed(() => {
  if (choiceStart.value === -1) return null;
  const end = choiceEnd.value;
  const block = end === -1
    ? context.message.slice(choiceStart.value)
    : context.message.slice(choiceStart.value, end + 10);
  const prompt = block.match(/prompt="(.*?)"/s)?.[1]?.trim() ?? '';
  const choiceMatches = [...block.matchAll(/<choice>(.*?)<\/choice>/gs)];
  const choices = choiceMatches.map(m => ({ text: m[1].trim() }));
  if (choices.length === 0) return null;
  return { prompt, choices };
});

// ── Quest card ─────────────────────────────────────────────────
const questStart = computed(() => context.message.lastIndexOf('<quest_card'));
const questEnd = computed(() => {
  const s = questStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</quest_card>', s);
});

const questData = computed(() => {
  if (questStart.value === -1) return null;
  const end = questEnd.value;
  const block = end === -1
    ? context.message.slice(questStart.value)
    : context.message.slice(questStart.value, end + 13);
  const title = block.match(/title="(\S+?)"/)?.[1] ?? '';
  const difficulty = block.match(/difficulty="(\S+?)"/)?.[1] ?? '';
  const reward = block.match(/reward="(\S+?)"/)?.[1] ?? '';
  const objective = block.match(/<objective>(.*?)<\/objective>/s)?.[1]?.trim() ?? '';
  if (!title) return null;
  return { title, difficulty, reward, objective };
});

// ── Spank card ──────────────────────────────────────────────────
const spankStart = computed(() => context.message.lastIndexOf('<spank_card'));
const spankEnd = computed(() => {
  const s = spankStart.value;
  if (s === -1) return -1;
  return context.message.indexOf('</spank_card>', s);
});

const spankData = computed(() => {
  if (spankStart.value === -1) return null;
  const end = spankEnd.value;
  const block = end === -1
    ? context.message.slice(spankStart.value)
    : context.message.slice(spankStart.value, end + 13);
  const round = block.match(/round="(\S+?)"/)?.[1] ?? '';
  const count = block.match(/count="(\S+?)"/)?.[1] ?? '';
  const tool = block.match(/tool="(.*?)"/s)?.[1]?.trim() ?? '';
  const color = block.match(/<color>(.*?)<\/color>/s)?.[1]?.trim() ?? '';
  const temperature = block.match(/<temperature>(.*?)<\/temperature>/s)?.[1]?.trim() ?? '';
  if (!count) return null;
  return { round, count, tool, color, temperature };
});

// ── Before / After text segments ───────────────────────────────
const allStarts = computed(() =>
  [locStart.value, charStart.value, shopStart.value, choiceStart.value, questStart.value, spankStart.value]
    .filter(i => i !== -1),
);

const allEnds = computed(() =>
  [locEnd.value, charEnd.value, shopEnd.value, choiceEnd.value, questEnd.value, spankEnd.value]
    .filter(i => i !== -1),
);

const firstTagStart = computed(() =>
  allStarts.value.length > 0 ? Math.min(...allStarts.value) : -1,
);

const lastTagEnd = computed(() => {
  if (allEnds.value.length === 0) return -1;
  const maxEnd = Math.max(...allEnds.value);
  // Find which tag produced this max end and add its closing tag length
  if (maxEnd === locEnd.value) return maxEnd + 16;
  if (maxEnd === charEnd.value) return maxEnd + 17;
  if (maxEnd === shopEnd.value) return maxEnd + 12;
  if (maxEnd === choiceEnd.value) return maxEnd + 10;
  if (maxEnd === questEnd.value) return maxEnd + 13;
  if (maxEnd === spankEnd.value) return maxEnd + 13;
  return maxEnd;
});

const before_html = computed(() => {
  const idx = firstTagStart.value;
  const text = idx === -1 ? undefined : context.message.slice(0, idx).trim();
  if (!text) return null;
  return formatAsDisplayedMessage(text, { message_id: context.message_id });
});

const after_html = computed(() => {
  const idx = lastTagEnd.value;
  if (idx === -1) return null;
  const text = context.message.slice(idx).trim();
  if (!text) return null;
  return formatAsDisplayedMessage(text, { message_id: context.message_id });
});

const hasAnyCard = computed(() =>
  locationData.value || characterData.value || shopData.value || choiceData.value || questData.value || spankData.value,
);

const full_html = computed(() =>
  formatAsDisplayedMessage(context.message, { message_id: context.message_id }),
);
</script>

<style lang="scss" scoped>
.streaming-wrapper {
  line-height: 1.6;
}
</style>
