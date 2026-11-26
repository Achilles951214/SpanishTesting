import { createEngine } from './engine.js';

const VERSION = 'v2026.11.26';
const MAX_HISTORY = 50;

const rng = Math.random;
let engine = createEngine(rng);

const el = {
  version: document.getElementById('version'),
  progress: document.getElementById('progress'),
  backBtn: document.getElementById('back-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  timer: document.getElementById('timer'),
  english: document.getElementById('english-text'),
  spanishBlock: document.getElementById('spanish-block'),
  spanish: document.getElementById('spanish-text'),
  tagReveal: document.getElementById('tag-text'),
  flagBtn: document.getElementById('flag-btn'),
  note: document.getElementById('note-text'),
  hint: document.getElementById('hint-text'),
  actionBtn: document.getElementById('action-btn'),
  overlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  completeOverlay: document.getElementById('complete-overlay'),
  completeBody: document.getElementById('complete-body'),
  restartBtn: document.getElementById('restart-btn'),
};

el.version.textContent = VERSION;

// Each history entry owns its own reveal state and timer, so stepping back
// to review an earlier card never disturbs the live one still in progress.
function newEntry(card) {
  // A card drawn from the flagged-repeat queue already comes back flagged —
  // reflect that immediately so the button doesn't lie about its own state.
  return { card, revealed: false, flagged: !!card.flagged, startTime: Date.now(), revealElapsedMs: null };
}

let history = [newEntry(engine.draw())];
let pointer = 0;
let paused = false;
let done = false; // deck exhausted and nothing flagged left to review

function entry() {
  return history[pointer];
}

function renderProgress() {
  const p = engine.progress();
  el.progress.textContent = p.reviewingFlagged && p.flaggedCount > 0
    ? `${p.total}/${p.total} · reviewing ${p.flaggedCount} flagged`
    : `${p.shown}/${p.total}`;
}

function render() {
  if (done) {
    el.completeOverlay.classList.remove('hidden');
    el.overlay.classList.add('hidden');
    return;
  }
  el.completeOverlay.classList.add('hidden');

  const e = entry();
  el.backBtn.disabled = pointer === 0;
  renderProgress();

  el.english.textContent = e.card.en;

  if (e.revealed) {
    el.spanishBlock.classList.remove('hidden');
    el.hint.classList.add('hidden');
    el.spanish.textContent = e.card.es;
    el.tagReveal.textContent = e.card.tag;
    el.flagBtn.textContent = e.flagged ? 'Flagged' : 'Flag to repeat';
    el.flagBtn.classList.toggle('flagged', e.flagged);
    if (e.card.note) {
      el.note.textContent = e.card.note;
      el.note.classList.remove('hidden');
    } else {
      el.note.classList.add('hidden');
    }
    el.actionBtn.textContent = 'Next sentence';
  } else {
    el.spanishBlock.classList.add('hidden');
    el.hint.classList.remove('hidden');
    el.actionBtn.textContent = 'Show Spanish';
  }

  el.overlay.classList.toggle('hidden', !paused);
}

function tick() {
  if (paused || done) return;
  const e = entry();
  const ms = e.revealed ? e.revealElapsedMs : Date.now() - e.startTime;
  el.timer.textContent = `${(ms / 1000).toFixed(1)}s`;
}
setInterval(tick, 100);

el.actionBtn.addEventListener('click', () => {
  if (done) return;
  const e = entry();
  if (!e.revealed) {
    e.revealed = true;
    e.revealElapsedMs = Date.now() - e.startTime;
    render();
    return;
  }

  if (pointer < history.length - 1) {
    // Already-seen card ahead (we stepped back earlier) — just move forward.
    pointer += 1;
  } else {
    const card = engine.draw();
    if (card === null) {
      done = true;
      const p = engine.progress();
      el.completeBody.textContent = `All ${p.total} sentences done, and nothing left flagged to review.`;
      render();
      return;
    }
    history.push(newEntry(card));
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
    pointer = history.length - 1;
  }
  render();
});

el.flagBtn.addEventListener('click', () => {
  const e = entry();
  if (!e.revealed) return;
  e.flagged = !e.flagged;
  engine.setFlag(e.card, e.flagged);
  render();
});

el.backBtn.addEventListener('click', () => {
  if (pointer > 0) {
    pointer -= 1;
    render();
  }
});

el.pauseBtn.addEventListener('click', () => {
  paused = true;
  render();
});

el.resumeBtn.addEventListener('click', () => {
  paused = false;
  const e = entry();
  if (!e.revealed) e.startTime = Date.now();
  render();
});

el.restartBtn.addEventListener('click', () => {
  engine = createEngine(rng);
  history = [newEntry(engine.draw())];
  pointer = 0;
  paused = false;
  done = false;
  render();
});

render();
tick();
