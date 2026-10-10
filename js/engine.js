// Picks what to show next: an independent weighted random draw every card,
// blending the curated seed tiers (weighted toward the highest-priority
// ones) with the general procedural generator (lower weight — "now and
// then" variety). No streak-holding, no repeat of the same verb/sentence as
// the card immediately before it.
import { SEED_TIERS } from './seeds.js';
import { PRETERITE_FOCUS_VERBS } from './verbs.js';
import { startSimple, buildSimpleSentence, startComplex, buildComplexSentence } from './sentences.js';

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

function drawCard(mode, rng) {
  const tiers = seedTiersForMode(mode).map((tier) => ({ kind: 'seed', tier, weight: tier.weight }));
  const pool = [...tiers, { kind: 'procedural', weight: PROCEDURAL_WEIGHT }];
  const chosen = weightedPick(pool, rng);

  if (chosen.kind === 'seed') {
    const index = Math.floor(rng() * chosen.tier.sentences.length);
    const item = chosen.tier.sentences[index];
    return {
      signature: `seed:${chosen.tier.id}:${index}`,
      card: { es: item.es, en: item.en, note: item.note, tag: `Tier ${chosen.tier.id} · ${chosen.tier.name}` },
    };
  }

  const state = mode === 'simple' ? biasedStartSimple(rng) : startComplex(rng);
  const card = mode === 'simple' ? buildSimpleSentence(state) : buildComplexSentence(state);
  const verbKey = mode === 'simple' ? state.verbInfinitive : state.verb2Infinitive;
  return { signature: `proc:${verbKey}`, card };
}

export function createEngine(rng) {
  let mode = 'simple';
  let lastSignature = null;
  let current;

  function draw() {
    let result = drawCard(mode, rng);
    // Avoid repeating the exact same verb/sentence as the card right before
    // it; a handful of retries is enough since the pool is large relative
    // to the chance of a repeat.
    for (let attempt = 0; attempt < 8 && result.signature === lastSignature; attempt++) {
      result = drawCard(mode, rng);
    }
    lastSignature = result.signature;
    current = result.card;
  }

  draw();

  return {
    get mode() {
      return mode;
    },
    current() {
      return current;
    },
    next() {
      draw();
      return current;
    },
    setMode(newMode) {
      if (newMode === mode) return current;
      mode = newMode;
      draw();
      return current;
    },
  };
}
