import {
  startSimple, advanceSimple, continueSameVerb, freshVerbSimple, buildSimpleSentence,
  startComplex, advanceComplex, continueSameVerbComplex, freshVerbComplex, buildComplexSentence,
} from './sentences.js';

const rng = Math.random;
const SET_SIZE = 5;

const el = {
  modeSimple: document.getElementById('mode-simple'),
  modeComplex: document.getElementById('mode-complex'),
  tag: document.getElementById('tag'),
  dots: document.getElementById('dots'),
  timer: document.getElementById('timer'),
  english: document.getElementById('english-text'),
  spanishBlock: document.getElementById('spanish-block'),
  spanish: document.getElementById('spanish-text'),
  hint: document.getElementById('hint-text'),
  actionBtn: document.getElementById('action-btn'),
  overlay: document.getElementById('prompt-overlay'),
  promptContinue: document.getElementById('prompt-continue'),
  promptFresh: document.getElementById('prompt-fresh'),
};

for (let i = 0; i < SET_SIZE; i++) {
  const dot = document.createElement('span');
  el.dots.appendChild(dot);
}
const dotEls = Array.from(el.dots.children);

let mode = 'simple';
let sentenceState = startSimple(rng);
let current = buildSimpleSentence(sentenceState);
let revealed = false;
let startTime = Date.now();
let revealElapsedMs = null;
let showingPrompt = false;

function build(state) {
  return mode === 'simple' ? buildSimpleSentence(state) : buildComplexSentence(state);
}

function resetTimer() {
  startTime = Date.now();
  revealElapsedMs = null;
}

function render() {
  el.modeSimple.setAttribute('aria-pressed', String(mode === 'simple'));
  el.modeComplex.setAttribute('aria-pressed', String(mode === 'complex'));

  el.tag.textContent = current.tag;
  dotEls.forEach((d, i) => d.classList.toggle('filled', i < sentenceState.setCount));

  el.english.textContent = current.en;

  if (revealed) {
    el.spanishBlock.classList.remove('hidden');
    el.hint.classList.add('hidden');
    el.spanish.textContent = current.es;
    el.actionBtn.textContent = 'Next sentence';
  } else {
    el.spanishBlock.classList.add('hidden');
    el.hint.classList.remove('hidden');
    el.actionBtn.textContent = 'Show Spanish';
  }

  el.overlay.classList.toggle('hidden', !showingPrompt);
}

function tick() {
  const ms = revealed ? revealElapsedMs : Date.now() - startTime;
  el.timer.textContent = `${(ms / 1000).toFixed(1)}s`;
}
setInterval(tick, 100);

function goToState(nextState) {
  sentenceState = nextState;
  current = build(sentenceState);
  revealed = false;
  showingPrompt = false;
  resetTimer();
  render();
}

el.actionBtn.addEventListener('click', () => {
  if (!revealed) {
    revealed = true;
    revealElapsedMs = Date.now() - startTime;
    render();
    return;
  }

  const wouldBeCount = sentenceState.setCount + 1;
  if (wouldBeCount >= SET_SIZE) {
    showingPrompt = true;
    render();
    return;
  }

  const nextState = mode === 'simple' ? advanceSimple(sentenceState, rng) : advanceComplex(sentenceState, rng);
  goToState(nextState);
});

el.promptContinue.addEventListener('click', () => {
  const nextState = mode === 'simple' ? continueSameVerb(sentenceState, rng) : continueSameVerbComplex(sentenceState, rng);
  goToState(nextState);
});

el.promptFresh.addEventListener('click', () => {
  const nextState = mode === 'simple' ? freshVerbSimple(sentenceState, rng) : freshVerbComplex(sentenceState, rng);
  goToState(nextState);
});

function setMode(newMode) {
  if (mode === newMode) return;
  mode = newMode;
  goToState(mode === 'simple' ? startSimple(rng) : startComplex(rng));
}

el.modeSimple.addEventListener('click', () => setMode('simple'));
el.modeComplex.addEventListener('click', () => setMode('complex'));

render();
tick();
