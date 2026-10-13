// Picks what to show next: one unified pool mixing easy and hard content —
// all 8 seed tiers (Tier 6 is the hard/subjunctive one, the rest are easy)
// plus the procedural generator (both its simple and complex templates) —
// with no separate mode. Every draw is an independent weighted random pick,
// and the same verb or seed sentence is blocked from recurring within the
// last RECENT_WINDOW draws (not just the immediately-previous one).
import { SEED_TIERS } from './seeds.js';
import { PRETERITE_FOCUS_VERBS } from './verbs.js';
import { startSimple, buildSimpleSentence, startComplex, buildComplexSentence } from './sentences.js';

// Procedural generation has far more headroom than any single seed tier
// (many verbs x tenses x subjects x templates), so it gets the biggest
// share here — the seed tiers stay in the mix but no longer dominate it.
const PROCEDURAL_SIMPLE_WEIGHT = 24;
const PROCEDURAL_COMPLEX_WEIGHT = 16;

const RECENT_WINDOW = 10;
const MAX_DRAW_ATTEMPTS = 20;

function weightedPick(items, rng) {
  const total = items.reduce((sum, it) => sum + it.weight, 0);
  let r = rng() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
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

function drawOnce(rng) {
  const pool = [
    ...SEED_TIERS.map((tier) => ({ kind: 'seed', tier, weight: tier.weight })),
    { kind: 'proceduralSimple', weight: PROCEDURAL_SIMPLE_WEIGHT },
    { kind: 'proceduralComplex', weight: PROCEDURAL_COMPLEX_WEIGHT },
  ];
  const chosen = weightedPick(pool, rng);

  if (chosen.kind === 'seed') {
    const index = Math.floor(rng() * chosen.tier.sentences.length);
    const item = chosen.tier.sentences[index];
    return {
      signature: `seed:${chosen.tier.id}:${index}`,
      card: { es: item.es, en: item.en, note: item.note, tag: `Tier ${chosen.tier.id} · ${chosen.tier.name}` },
    };
  }

  if (chosen.kind === 'proceduralSimple') {
    const state = biasedStartSimple(rng);
    return { signature: `verb:${state.verbInfinitive}`, card: buildSimpleSentence(state) };
  }

  const state = startComplex(rng);
  return { signature: `verb:${state.verb2Infinitive}`, card: buildComplexSentence(state) };
}

export function createEngine(rng) {
  const recent = [];

  function draw() {
    let result = drawOnce(rng);
    for (let attempt = 0; attempt < MAX_DRAW_ATTEMPTS && recent.includes(result.signature); attempt++) {
      result = drawOnce(rng);
    }
    recent.push(result.signature);
    if (recent.length > RECENT_WINDOW) recent.shift();
    return result.card;
  }

  return { draw };
}
