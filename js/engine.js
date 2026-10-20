// Picks what to show next: a shuffled "bag" that round-robins through every
// seed tier exactly once per cycle, plus one procedural slot, so a session
// reliably sees the full spread of patterns instead of leaning on whichever
// tiers chance happens to favor. Every tier gets equal footing in the bag —
// that round-robin guarantee is itself what keeps the currently-flagged
// priority tiers (1, 9, 10) showing up every cycle, with no extra weighting
// needed. When the bag empties, it's rebuilt and reshuffled for the next one.
import { SEED_TIERS } from './seeds.js';
import { PRETERITE_FOCUS_VERBS } from './verbs.js';
import { startSimple, buildSimpleSentence, startComplex, buildComplexSentence } from './sentences.js';

function shuffled(arr, rng) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildBag(rng) {
  const slots = SEED_TIERS.map((tier) => ({ kind: 'seed', tier }));
  slots.push({ kind: 'procedural' });
  return shuffled(slots, rng);
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

export function createEngine(rng) {
  let bag = [];
  const lastSeedIndex = {}; // tier id -> last sentence index shown, to avoid an immediate repeat
  let lastProcVerb = null;

  function drawSeed(tier) {
    const sentences = tier.sentences;
    let index = Math.floor(rng() * sentences.length);
    if (sentences.length > 1) {
      while (index === lastSeedIndex[tier.id]) index = Math.floor(rng() * sentences.length);
    }
    lastSeedIndex[tier.id] = index;
    const item = sentences[index];
    return { es: item.es, en: item.en, note: item.note, tag: `Tier ${tier.id} · ${tier.name}` };
  }

  function drawProcedural() {
    const useSimple = rng() < 0.5;
    let state = useSimple ? biasedStartSimple(rng) : startComplex(rng);
    let verbKey = useSimple ? state.verbInfinitive : state.verb2Infinitive;
    if (verbKey === lastProcVerb) {
      state = useSimple ? biasedStartSimple(rng) : startComplex(rng);
      verbKey = useSimple ? state.verbInfinitive : state.verb2Infinitive;
    }
    lastProcVerb = verbKey;
    return useSimple ? buildSimpleSentence(state) : buildComplexSentence(state);
  }

  return {
    draw() {
      if (bag.length === 0) bag = buildBag(rng);
      const slot = bag.pop();
      return slot.kind === 'seed' ? drawSeed(slot.tier) : drawProcedural();
    },
  };
}
