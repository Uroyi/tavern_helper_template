<template>
  <div class="streaming-wrapper">
    <template v-for="(segment, index) in segments" :key="index">
      <!-- Text segment -->
      <NarrativeBox v-if="segment.type === 'text'" :html="segment.html" />
      <!-- Card segments -->
      <LocationCard v-else-if="segment.type === 'location'" v-bind="segment.data" />
      <CharacterCard v-else-if="segment.type === 'character'" v-bind="segment.data" />
      <ShopMenuCard v-else-if="segment.type === 'shop'" v-bind="segment.data" />
      <ChoiceCard
        v-else-if="segment.type === 'choice'"
        v-bind="segment.data"
        :disabled="context.during_streaming"
      />
      <QuestCard v-else-if="segment.type === 'quest'" v-bind="segment.data" />
      <SpankCard v-else-if="segment.type === 'spank'" v-bind="segment.data" />
      <SideQuestEndCard v-else-if="segment.type === 'sidequest_end'" v-bind="segment.data" />
      <StatusBarPanel v-else-if="segment.type === 'status_bar'" />
    </template>
    <!-- Fallback: no tags detected, render full message -->
    <NarrativeBox v-if="!hasAnyCard && context.message" :html="full_html" />
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
import SideQuestEndCard from './components/SideQuestEndCard.vue';
import NarrativeBox from './components/NarrativeBox.vue';
import StatusBarPanel from './components/StatusBarPanel.vue';

const context = injectStreamingMessageContext();

// ── Quote colorization ────────────────────────────────────────────

function colorizeQuotes(html: string): string {
  // Chinese double quotes “” — spoken dialogue
  html = html.replace(/“([^”]*)”/g, '<span class="q-double">“$1”</span>');
  // Chinese single quotes ‘’ — inner thoughts / emphasis
  html = html.replace(/‘([^’]*)’/g, '<span class="q-single">‘$1’</span>');
  // Japanese corner brackets 「」 — quoted text / book titles
  html = html.replace(/「([^」]*)」/g, '<span class="q-corner">「$1」</span>');
  return html;
}

// ── Segment types ────────────────────────────────────────────────

interface CardSegment {
  type: 'location' | 'character' | 'shop' | 'choice' | 'quest' | 'spank' | 'sidequest_end';
  data: Record<string, unknown>;
  start: number;
  end: number; // position after closing tag
}

interface TextSegment {
  type: 'text';
  html: string;
}

interface StatusBarSegment {
  type: 'status_bar';
}

type Segment = CardSegment | TextSegment | StatusBarSegment;

// ── Card parsing helpers ─────────────────────────────────────────

function* findCharacterCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<character_card', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</character_card>', start);
    const end = endTag === -1 ? msg.length : endTag + 17;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const name = block.match(/name="(\S+?)"/)?.[1] ?? '';
    const role = block.match(/<role>(.*?)<\/role>/s)?.[1]?.trim() ?? '';
    const description = block.match(/<description>(.*?)<\/description>/s)?.[1]?.trim() ?? '';
    if (name) {
      yield { type: 'character', data: { name, role, description }, start, end };
    }
    pos = end;
  }
}

function* findLocationCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<location_card', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</location_card>', start);
    const end = endTag === -1 ? msg.length : endTag + 16;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const type = block.match(/type="(\S+?)"/)?.[1] ?? '';
    const name = block.match(/<name>(.*?)<\/name>/s)?.[1]?.trim() ?? '';
    const description = block.match(/<description>(.*?)<\/description>/s)?.[1]?.trim() ?? '';
    if (name || description) {
      yield { type: 'location', data: { type, name, description }, start, end };
    }
    pos = end;
  }
}

function* findShopCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<shop_menu', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</shop_menu>', start);
    const end = endTag === -1 ? msg.length : endTag + 12;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const name = block.match(/name="(\S+?)"/)?.[1] ?? '';
    const itemMatches = [...block.matchAll(/<item price="(\d+)">(.*?)<\/item>/gs)];
    const items = itemMatches.map(m => ({ text: m[2].trim(), price: Number(m[1]) }));
    if (name || items.length > 0) {
      yield { type: 'shop', data: { name, items }, start, end };
    }
    pos = end;
  }
}

function* findChoiceCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<choices', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</choices>', start);
    const end = endTag === -1 ? msg.length : endTag + 10;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const prompt = block.match(/prompt="(.*?)"/s)?.[1]?.trim() ?? '';
    const choiceMatches = [...block.matchAll(/<choice>(.*?)<\/choice>/gs)];
    const choices = choiceMatches.map(m => ({ text: m[1].trim() }));
    if (choices.length > 0) {
      yield { type: 'choice', data: { prompt, choices }, start, end };
    }
    pos = end;
  }
}

function* findQuestCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<quest_card', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</quest_card>', start);
    const end = endTag === -1 ? msg.length : endTag + 13;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const title = block.match(/title="(\S+?)"/)?.[1] ?? '';
    const difficulty = block.match(/difficulty="(\S+?)"/)?.[1] ?? '';
    const reward = block.match(/reward="(\S+?)"/)?.[1] ?? '';
    const objective = block.match(/<objective>(.*?)<\/objective>/s)?.[1]?.trim() ?? '';
    if (title) {
      yield { type: 'quest', data: { title, difficulty, reward, objective }, start, end };
    }
    pos = end;
  }
}

function* findSideQuestEndCards(msg: string): Generator<CardSegment> {
  const regex = /<sidequest_end\s+character="([^"]+)"\s+sq="([^"]+)"\s*\/?>/gsi;
  let match;
  while ((match = regex.exec(msg)) !== null) {
    yield {
      type: 'sidequest_end',
      data: { character: match[1], sq: match[2] },
      start: match.index,
      end: match.index + match[0].length,
    };
  }
}

function* findSpankCards(msg: string): Generator<CardSegment> {
  let pos = 0;
  while (true) {
    const start = msg.indexOf('<spank_card', pos);
    if (start === -1) return;
    const endTag = msg.indexOf('</spank_card>', start);
    const end = endTag === -1 ? msg.length : endTag + 13;
    const block = endTag === -1 ? msg.slice(start) : msg.slice(start, end);
    const round = block.match(/round="(\S+?)"/)?.[1] ?? '';
    const count = block.match(/count="(\S+?)"/)?.[1] ?? '';
    const tool = block.match(/tool="(.*?)"/s)?.[1]?.trim() ?? '';
    const color = block.match(/<color>(.*?)<\/color>/s)?.[1]?.trim() ?? '';
    const temperature = block.match(/<temperature>(.*?)<\/temperature>/s)?.[1]?.trim() ?? '';
    if (count) {
      yield { type: 'spank', data: { round, count, tool, color, temperature }, start, end };
    }
    pos = end;
  }
}

// ── Segments: parse all cards in document order ───────────────────

const STATUS_PLACEHOLDER = '<StatusPlaceHolderImpl/>';

const segments = computed<Segment[]>(() => {
  const msg = context.message;
  if (!msg) return [];

  // Collect ALL card occurrences from all types
  const cards: CardSegment[] = [
    ...findLocationCards(msg),
    ...findCharacterCards(msg),
    ...findShopCards(msg),
    ...findChoiceCards(msg),
    ...findQuestCards(msg),
    ...findSpankCards(msg),
    ...findSideQuestEndCards(msg),
  ];

  // Sort by position in message
  cards.sort((a, b) => a.start - b.start);

  // Find all status placeholder positions in raw message
  const placeholderPositions: number[] = [];
  let searchPos = 0;
  while (true) {
    const idx = msg.indexOf(STATUS_PLACEHOLDER, searchPos);
    if (idx === -1) break;
    placeholderPositions.push(idx);
    searchPos = idx + STATUS_PLACEHOLDER.length;
  }

  // Build segments: interleave text, cards, and status bar in document order
  const result: Segment[] = [];
  let pos = 0;
  let placeholderIdx = 0;

  for (const card of cards) {
    // Check for placeholder(s) between pos and card.start
    while (placeholderIdx < placeholderPositions.length && placeholderPositions[placeholderIdx] < card.start) {
      if (placeholderPositions[placeholderIdx] > pos) {
        const text = msg.slice(pos, placeholderPositions[placeholderIdx]).trim();
        if (text) {
          result.push({
            type: 'text',
            html: colorizeQuotes(formatAsDisplayedMessage(text, { message_id: context.message_id })),
          });
        }
      }
      result.push({ type: 'status_bar' });
      pos = placeholderPositions[placeholderIdx] + STATUS_PLACEHOLDER.length;
      placeholderIdx++;
    }

    // Text before this card
    if (card.start > pos) {
      const text = msg.slice(pos, card.start).trim();
      if (text) {
        result.push({
          type: 'text',
          html: colorizeQuotes(formatAsDisplayedMessage(text, { message_id: context.message_id })),
        });
      }
    }
    // The card itself
    result.push(card);
    pos = card.end;
  }

  // Remaining placeholders after last card
  while (placeholderIdx < placeholderPositions.length) {
    if (placeholderPositions[placeholderIdx] > pos) {
      const text = msg.slice(pos, placeholderPositions[placeholderIdx]).trim();
      if (text) {
        result.push({
          type: 'text',
          html: formatAsDisplayedMessage(text, { message_id: context.message_id }),
        });
      }
    }
    result.push({ type: 'status_bar' });
    pos = placeholderPositions[placeholderIdx] + STATUS_PLACEHOLDER.length;
    placeholderIdx++;
  }

  // Trailing text after last card
  if (pos < msg.length) {
    const text = msg.slice(pos).trim();
    if (text) {
      result.push({
        type: 'text',
        html: formatAsDisplayedMessage(text, { message_id: context.message_id }),
      });
    }
  }

  return result;
});

// ── Has any card? ─────────────────────────────────────────────────

const hasAnyCard = computed(() =>
  segments.value.some(s => s.type !== 'text'),
);

// ── Fallback full render ──────────────────────────────────────────

const full_html = computed(() =>
  colorizeQuotes(formatAsDisplayedMessage(context.message, { message_id: context.message_id })),
);
</script>

<style lang="scss" scoped>
.streaming-wrapper {
  line-height: 1.6;
}
</style>
