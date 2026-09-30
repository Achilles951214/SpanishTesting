import { createEngine } from './engine.js';

const rng = Math.random;
const engine = createEngine(rng);

const el = {
  modeSimple: document.getElementById('mode-simple'),
  modeComplex: document.getElementById('mode-complex'),
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

let current = engine.current();
let revealed = false;
let startTime = Date.now();
let revealElapsedMs = null;
let paused = false;

function resetTimer() {
  startTime = Date.now();
  revealElapsedMs = null;
}

function render() {
  el.modeSimple.setAttribute('aria-pressed', String(engine.mode === 'simple'));
  el.modeComplex.setAttribute('aria-pressed', String(engine.mode === 'complex'));

  el.tag.textContent = current.tag;
  el.english.textContent = current.en;

  if (revealed) {
    el.spanishBlock.classList.remove('hidden');
    el.hint.classList.add('hidden');
    el.spanish.textContent = current.es;
    if (current.note) {
      el.note.textContent = current.note;
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
  const ms = revealed ? revealElapsedMs : Date.now() - startTime;
  el.timer.textContent = `${(ms / 1000).toFixed(1)}s`;
}
setInterval(tick, 100);

el.actionBtn.addEventListener('click', () => {
  if (!revealed) {
    revealed = true;
    revealElapsedMs = Date.now() - startTime;
    render();
    return;
  }
  current = engine.next();
  revealed = false;
  resetTimer();
  render();
});

function setMode(newMode) {
  if (engine.mode === newMode) return;
  current = engine.setMode(newMode);
  revealed = false;
  resetTimer();
  render();
}

el.modeSimple.addEventListener('click', () => setMode('simple'));
el.modeComplex.addEventListener('click', () => setMode('complex'));

el.pauseBtn.addEventListener('click', () => {
  paused = true;
  render();
});

el.resumeBtn.addEventListener('click', () => {
  paused = false;
  resetTimer();
  render();
});

render();
tick();
