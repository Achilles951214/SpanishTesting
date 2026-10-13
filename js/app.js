import { createEngine } from './engine.js';

const VERSION = 'v2026.10.13';
const MAX_HISTORY = 50;

const rng = Math.random;
const engine = createEngine(rng);

const el = {
  version: document.getElementById('version'),
  backBtn: document.getElementById('back-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  tag: document.getElementById('tag'),
  timer: document.getElementById('timer'),
  english: document.getElementById('english-text'),
  spanishBlock: document.getElementById('spanish-block'),
  spanish: document.getElementById('spanish-text'),
  note: document.getElementById('note-text'),
  hint: document.getElementById('hint-text'),
  actionBtn: document.getElementById('action-btn'),
  overlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
};

el.version.textContent = VERSION;

// Each history entry owns its own reveal state and timer, so stepping back
// to review an earlier card never disturbs the live one still in progress.
function newEntry(card) {
  return { card, revealed: false, startTime: Date.now(), revealElapsedMs: null };
}

let history = [newEntry(engine.draw())];
let pointer = 0;
let paused = false;

function entry() {
  return history[pointer];
}

function render() {
  const e = entry();
  el.backBtn.disabled = pointer === 0;

  el.tag.textContent = e.card.tag;
  el.english.textContent = e.card.en;

  if (e.revealed) {
    el.spanishBlock.classList.remove('hidden');
    el.hint.classList.add('hidden');
    el.spanish.textContent = e.card.es;
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
  if (paused) return;
  const e = entry();
  const ms = e.revealed ? e.revealElapsedMs : Date.now() - e.startTime;
  el.timer.textContent = `${(ms / 1000).toFixed(1)}s`;
}
setInterval(tick, 100);

el.actionBtn.addEventListener('click', () => {
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
    history.push(newEntry(engine.draw()));
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
    pointer = history.length - 1;
  }
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

render();
tick();
