// A fixed 100-sentence test deck, shuffled once per session and walked
// through in order — no procedural generation, no tier-ticket weighting.
// Each of the 100 is shown exactly once. The only thing that repeats is a
// card the user flags: once the deck is exhausted, flagged cards cycle
// round-robin (shuffled among themselves) for as long as any stay flagged.
// Unflagging a card drops it from that rotation immediately.
import { TEST_DECK, TIER_KEY } from './seeds.js';

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
  return { es: item.es, en: item.en, note: item.note, tag: formatTag(item.tiers), flagged };
}

export function createEngine(rng) {
  const deck = shuffled(TEST_DECK, rng);
  const total = deck.length;
  let deckPointer = 0; // how many of the 100 have been drawn so far
  const flagged = []; // TEST_DECK items currently flagged, cycled once the deck is done
  let flagPointer = 0;

  return {
    total,

    // Returns a card, or null when there's nothing left to show (the deck
    // is done and nothing is currently flagged).
    draw() {
      if (deckPointer < total) {
        const item = deck[deckPointer];
        deckPointer += 1;
        return cardFor(item, false);
      }
      if (flagged.length === 0) return null;
      const item = flagged[flagPointer % flagged.length];
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
        flaggedCount: flagged.length,
      };
    },

    setFlag(card, isFlagged) {
      const index = flagged.findIndex((item) => item.es === card.es);
      if (isFlagged && index === -1) {
        const item = TEST_DECK.find((it) => it.es === card.es);
        if (item) flagged.push(item);
      } else if (!isFlagged && index !== -1) {
        flagged.splice(index, 1);
      }
    },
  };
}
