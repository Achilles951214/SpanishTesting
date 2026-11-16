// Picks what to show next: a shuffled "bag" that round-robins through every
// seed tier at least once per cycle, plus one procedural slot, so a session
// reliably sees the full spread of patterns instead of leaning on whichever
// tiers chance happens to favor. Every tier is still fully guaranteed every
// cycle — the weighting below only changes how MANY tickets a tier gets in
// the shuffle, never whether it shows up. When the bag empties, it's rebuilt
// and reshuffled for the next one.
//
// TIER_TICKETS gives tiers 19-26 (the newest content) extra tickets per
// cycle, tapering down toward Tier 1, per the user's request to mix all
// tiers in one shuffled session while leaning toward the most recent errors
// rather than any one rule. Every tier not listed here (1-18) gets the
// default of 1 ticket, unchanged from before.
const TIER_TICKETS = { 26: 4, 25: 4, 24: 3, 23: 3, 22: 3, 21: 3, 20: 2, 19: 2 };

// Flagging a card (app.js's Flag button) adds it as an extra slot in every
// future bag alongside the seed tiers, so it repeats roughly once per cycle
// too — a deliberate, in-session-only boost. There's no persistence here:
// flags live only in this engine instance and vanish on reload.
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
  const boosted = []; // cards the user flagged — replayed verbatim, not regenerated

  function buildBag() {
    const slots = [];
    for (const tier of SEED_TIERS) {
      const tickets = TIER_TICKETS[tier.id] || 1;
      for (let i = 0; i < tickets; i++) slots.push({ kind: 'seed', tier });
    }
    slots.push({ kind: 'procedural' });
    for (const card of boosted) slots.push({ kind: 'boosted', card });
    return shuffled(slots, rng);
  }

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
      if (bag.length === 0) bag = buildBag();
      const slot = bag.pop();
      if (slot.kind === 'seed') return drawSeed(slot.tier);
      if (slot.kind === 'procedural') return drawProcedural();
      return slot.card;
    },

    setFlag(card, flagged) {
      const index = boosted.findIndex((c) => c.es === card.es);
      if (flagged && index === -1) boosted.push(card);
      if (!flagged && index !== -1) boosted.splice(index, 1);
      // Mid-cycle flags join the very next bag, not retroactively this one.
    },
  };
}
