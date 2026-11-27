import { createEngine } from './engine.js';
import { TEST_DECK } from './seeds.js';
import { loadChunk, saveChunk, clearChunk } from './storage.js';

const VERSION = 'v2026.11.27';
const MAX_HISTORY = 50;
const CHUNK_SIZE = 25;

const rng = Math.random;

const CHUNKS = [];
for (let i = 0; i < TEST_DECK.length; i += CHUNK_SIZE) {
  CHUNKS.push(TEST_DECK.slice(i, i + CHUNK_SIZE));
}

const el = {
  pickerView: document.getElementById('picker-view'),
  versionPicker: document.getElementById('version-picker'),
  chunkList: document.getElementById('chunk-list'),

  practiceView: document.getElementById('practice-view'),
  version: document.getElementById('version'),
  progress: document.getElementById('progress'),
  setsBtn: document.getElementById('sets-btn'),
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
  toSetsBtn: document.getElementById('to-sets-btn'),
};

el.version.textContent = VERSION;
el.versionPicker.textContent = VERSION;

let engine = null;
let chunkIndex = null;
let history = [];
let pointer = 0;
let paused = false;
let done = false;

function chunkRange(i) {
  const start = i * CHUNK_SIZE + 1;
  const end = Math.min(start + CHUNK_SIZE - 1, TEST_DECK.length);
  return { start, end };
}

function chunkStatus(i) {
  const saved = loadChunk(i);
  if (!saved) return { label: 'Not started', done: false };
  const total = CHUNKS[i].length;
  const shown = Math.min(saved.deckPointer, total);
  const reviewingFlagged = saved.deckPointer >= total;
  const flaggedCount = saved.flaggedNs.length;
  if (reviewingFlagged && flaggedCount === 0) return { label: 'Done', done: true };
  if (reviewingFlagged) return { label: `${total}/${total} · ${flaggedCount} flagged`, done: false };
  return { label: `${shown}/${total}`, done: false };
}

function renderPicker() {
  el.chunkList.innerHTML = '';
  CHUNKS.forEach((_, i) => {
    const { start, end } = chunkRange(i);
    const status = chunkStatus(i);
    const btn = document.createElement('button');
    btn.className = 'chunk-btn' + (status.done ? ' chunk-done' : '');
    btn.innerHTML = `<span class="chunk-name">Set ${i + 1} · ${start}–${end}</span><span class="chunk-status">${status.label}</span>`;
    btn.addEventListener('click', () => enterChunk(i));
    el.chunkList.appendChild(btn);
  });
}

function showPicker() {
  renderPicker();
  el.pickerView.classList.remove('hidden');
  el.practiceView.classList.add('hidden');
}

function showPractice() {
  el.pickerView.classList.add('hidden');
  el.practiceView.classList.remove('hidden');
}

function persist() {
  if (chunkIndex === null) return;
  saveChunk(chunkIndex, engine.getState());
}

// Each history entry owns its own reveal state and timer, so stepping back
// to review an earlier card never disturbs the live one still in progress.
function newEntry(card) {
  // A card drawn from the flagged-repeat queue already comes back flagged —
  // reflect that immediately so the button doesn't lie about its own state.
  return { card, revealed: false, flagged: !!card.flagged, startTime: Date.now(), revealElapsedMs: null };
}

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
  if (paused || done || chunkIndex === null) return;
  const e = entry();
  const ms = e.revealed ? e.revealElapsedMs : Date.now() - e.startTime;
  el.timer.textContent = `${(ms / 1000).toFixed(1)}s`;
}
setInterval(tick, 100);

function enterChunk(i) {
  chunkIndex = i;
  const saved = loadChunk(i);
  engine = createEngine(rng, CHUNKS[i], saved || undefined);
  paused = false;

  const card = engine.draw();
  persist();
  if (card === null) {
    done = true;
    const p = engine.progress();
    el.completeBody.textContent = `All ${p.total} sentences in this set are done, and nothing's left flagged to review.`;
    history = [];
  } else {
    done = false;
    history = [newEntry(card)];
    pointer = 0;
  }

  showPractice();
  render();
}

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
    persist();
    if (card === null) {
      done = true;
      const p = engine.progress();
      el.completeBody.textContent = `All ${p.total} sentences in this set are done, and nothing's left flagged to review.`;
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
  persist();
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
  clearChunk(chunkIndex);
  enterChunk(chunkIndex);
});

el.setsBtn.addEventListener('click', showPicker);
el.toSetsBtn.addEventListener('click', showPicker);

showPicker();
tick();
