// Drives a single chunk (a slice of TEST_DECK, 25 items) — shuffled once and
// walked through in order, no procedural generation, no tier-ticket
// weighting. Each item is shown exactly once. The only thing that repeats
// is a card the user flags: once the chunk is exhausted, flagged cards
// cycle round-robin (shuffled among themselves) for as long as any stay
// flagged. Unflagging a card drops it from that rotation immediately.
//
// Cards are matched by their stable `n` (sentence number), not by text, so
// state can be serialized to plain numbers via getState() and handed back
// via the `initialState` param to resume a chunk exactly where it left off
// (app.js persists this to localStorage after every draw/flag).
import { TIER_KEY } from './seeds.js';

function shuffled(arr, rng) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTag(tiers) {
  const labels = [];
  for (const t of tiers) {
    const label = TIER_KEY[t];
    if (label && !labels.includes(label)) labels.push(label);
  }
  const word = tiers.length > 1 ? 'Tiers' : 'Tier';
  const nums = tiers.join(', ');
  return labels.length > 0 ? `${word} ${nums} · ${labels.join(', ')}` : `${word} ${nums}`;
}

function cardFor(item, flagged) {
  return { n: item.n, es: item.es, en: item.en, note: item.note, tag: formatTag(item.tiers), flagged };
}

export function createEngine(rng, items, initialState) {
  const total = items.length;
  const byN = new Map(items.map((item) => [item.n, item]));

  let order; // item.n values, in draw order
  let deckPointer;
  let flaggedNs; // item.n values currently flagged
  let flagPointer;

  if (initialState) {
    order = initialState.order.slice();
    deckPointer = initialState.deckPointer;
    flaggedNs = initialState.flaggedNs.slice();
    flagPointer = initialState.flagPointer || 0;
  } else {
    order = shuffled(items, rng).map((item) => item.n);
    deckPointer = 0;
    flaggedNs = [];
    flagPointer = 0;
  }

  return {
    total,

    // Returns a card, or null when there's nothing left to show (the chunk
    // is done and nothing is currently flagged).
    draw() {
      if (deckPointer < total) {
        const item = byN.get(order[deckPointer]);
        deckPointer += 1;
        return cardFor(item, false);
      }
      if (flaggedNs.length === 0) return null;
      const item = byN.get(flaggedNs[flagPointer % flaggedNs.length]);
      flagPointer += 1;
      return cardFor(item, true);
    },

    // { shown, total, reviewingFlagged, flaggedCount } — shown is capped at
    // total, since cards shown during flagged-review don't advance the count.
    progress() {
      return {
        shown: Math.min(deckPointer, total),
        total,
        reviewingFlagged: deckPointer >= total,
        flaggedCount: flaggedNs.length,
      };
    },

    setFlag(card, isFlagged) {
      const index = flaggedNs.indexOf(card.n);
      if (isFlagged && index === -1) flaggedNs.push(card.n);
      else if (!isFlagged && index !== -1) flaggedNs.splice(index, 1);
    },

    getState() {
      return { order: order.slice(), deckPointer, flaggedNs: flaggedNs.slice(), flagPointer };
    },
  };
}
