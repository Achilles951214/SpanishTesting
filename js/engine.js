// Picks what to show next: a shuffled "bag" that round-robins through every
// seed tier at least once per cycle, plus one procedural slot, so a session
// reliably sees the full spread of patterns instead of leaning on whichever
// tiers chance happens to favor. Every tier is still fully guaranteed every
// cycle — the weighting below only changes how MANY tickets a tier gets in
// the shuffle, never whether it shows up. When the bag empties, it's rebuilt
// and reshuffled for the next one.
//
// TIER_TICKETS follows the explicit priority order from the 22 Nov seed
// list update (highest first): Tier 27/22 (verb matches the subject),
// Tier 21 (preterite vs. subjunctive endings), Tier 33 (future vs.
// conditional), Tier 19/15 (reflexive and object pronouns), Tier 28/29
// (por/para, "no" before the verb, de, ser/estar), Tier 34 (hay/había),
// then the sentence banks (23, 31) and everything else at the default of
// 1 ticket. This fully replaces the earlier recency-based weighting —
// priorities move as old errors get fixed and new ones show up.
const TIER_TICKETS = {
  27: 6, 22: 6,
  21: 5,
  33: 4,
  19: 3, 15: 3,
  28: 2, 29: 2,
  34: 2,
};

// Flagging a card (app.js's Flag button) adds it as an extra slot in every
// future bag alongside the seed tiers, so it repeats roughly once per cycle
// too — a deliberate, in-session-only boost. Demoting a card (app.js's "Got
// it" button) is the opposite: it's excluded from its tier's draw pool for
// the rest of the session, so it stops coming up without needing to be
// deleted from seeds.js. A card can't be both — setting one clears the
// other. There's no persistence here: flags and demotions live only in this
// engine instance and vanish on reload.
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
  const lastSeedEs = {}; // tier id -> es text last shown, to avoid an immediate repeat
  let lastProcVerb = null;
  const boosted = []; // cards the user flagged — replayed verbatim, not regenerated
  const excluded = new Set(); // es text of cards the user demoted — skipped when drawing their tier

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
    const available = tier.sentences.filter((s) => !excluded.has(s.es));
    // If every sentence in this tier got demoted, fall back to the full set
    // rather than locking the tier out entirely.
    const pool = available.length > 0 ? available : tier.sentences;
    let candidates = pool;
    if (pool.length > 1) {
      const withoutLast = pool.filter((s) => s.es !== lastSeedEs[tier.id]);
      if (withoutLast.length > 0) candidates = withoutLast;
    }
    const item = candidates[Math.floor(rng() * candidates.length)];
    lastSeedEs[tier.id] = item.es;
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
      if (flagged) {
        excluded.delete(card.es);
        if (index === -1) boosted.push(card);
      } else if (index !== -1) {
        boosted.splice(index, 1);
      }
      // Mid-cycle flags join the very next bag, not retroactively this one.
    },

    setDemoted(card, demoted) {
      if (demoted) {
        excluded.add(card.es);
        const index = boosted.findIndex((c) => c.es === card.es);
        if (index !== -1) boosted.splice(index, 1);
      } else {
        excluded.delete(card.es);
      }
      // Already-built bags may still hold a stale ticket for this tier;
      // the exclusion applies from the next time that tier is actually drawn.
    },
  };
}
