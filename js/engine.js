// Orchestrates what to show next: blends the curated, tier-weighted seed
// sentences with the procedural generator, and holds one "focus" (a seed
// tier, or a procedural verb/template) for a random streak of 3-5 cards
// before rolling a new one — automatically, with no user choice involved.
import { SEED_TIERS } from './seeds.js';
import { PRETERITE_FOCUS_VERBS } from './verbs.js';
import {
  startSimple, advanceSimple, buildSimpleSentence,
  startComplex, advanceComplex, buildComplexSentence,
} from './sentences.js';

// Weight for "let the procedural generator pick anything" within a mode,
// on the same scale as the seed tiers' own weights (see seeds.js).
const PROCEDURAL_WEIGHT = 10;

function weightedPick(items, rng) {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

function randomStreak(rng) {
  return 3 + Math.floor(rng() * 3); // 3, 4, or 5
}

function shuffledIndices(n, rng) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function seedTiersForMode(mode) {
  return SEED_TIERS.filter((t) => t.mode === mode);
}

// Tier 1 (preterite person-agreement) is the top-flagged error — nudge the
// procedural generator toward its verb list too, not just the seed bank.
function biasedStartSimple(rng) {
  if (rng() < 0.35) {
    for (let i = 0; i < 6; i++) {
      const candidate = startSimple(rng);
      if (PRETERITE_FOCUS_VERBS.includes(candidate.verbInfinitive)) return candidate;
    }
  }
  return startSimple(rng);
}

function pickFocus(mode, rng) {
  const tiers = seedTiersForMode(mode).map((tier) => ({ kind: 'seed', tier, weight: tier.weight }));
  const pool = [...tiers, { kind: 'procedural', weight: PROCEDURAL_WEIGHT }];
  return weightedPick(pool, rng);
}

export function createEngine(rng) {
  let mode = 'simple';
  let focus;
  let streakRemaining;
  let proceduralState;
  let seedOrder;
  let seedPos;

  function rollFocus() {
    focus = pickFocus(mode, rng);
    streakRemaining = randomStreak(rng);
    if (focus.kind === 'procedural') {
      proceduralState = mode === 'simple' ? biasedStartSimple(rng) : startComplex(rng);
      seedOrder = null;
      seedPos = 0;
    } else {
      proceduralState = null;
      seedOrder = shuffledIndices(focus.tier.sentences.length, rng);
      seedPos = 0;
    }
  }

  function currentCard() {
    if (focus.kind === 'seed') {
      const item = focus.tier.sentences[seedOrder[seedPos]];
      return { es: item.es, en: item.en, note: item.note, tag: `Tier ${focus.tier.id} · ${focus.tier.name}` };
    }
    return mode === 'simple' ? buildSimpleSentence(proceduralState) : buildComplexSentence(proceduralState);
  }

  rollFocus();

  return {
    get mode() {
      return mode;
    },
    current() {
      return currentCard();
    },
    next() {
      streakRemaining -= 1;
      if (streakRemaining <= 0) {
        rollFocus();
      } else if (focus.kind === 'seed') {
        seedPos += 1;
      } else {
        proceduralState = mode === 'simple' ? advanceSimple(proceduralState, rng) : advanceComplex(proceduralState, rng);
      }
      return currentCard();
    },
    setMode(newMode) {
      if (newMode === mode) return currentCard();
      mode = newMode;
      rollFocus();
      return currentCard();
    },
  };
}
