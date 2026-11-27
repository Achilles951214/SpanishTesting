// Per-chunk progress, saved to localStorage so a set you're partway through
// survives a reload or the PWA being closed and reopened — "not repeat if
// the app resets," per the user's own words. Wrapped defensively: a private
// window or blocked site data just means progress doesn't persist, not that
// the app breaks.
const KEY = 'conjuga-chunk-progress-v1';

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function loadChunk(chunkIndex) {
  const all = loadAll();
  return all[chunkIndex] || null;
}

export function saveChunk(chunkIndex, state) {
  try {
    const all = loadAll();
    all[chunkIndex] = state;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore — progress just won't persist this session
  }
}

export function clearChunk(chunkIndex) {
  try {
    const all = loadAll();
    delete all[chunkIndex];
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}
