/**
 * The reel's arithmetic (components/work/reel-sync.tsx), kept pure so it can be
 * tested without a browser. `positions` are where each study starts along the
 * window's scroll axis, `scroll` is how far the window has scrolled and
 * `maxScroll` how far it can.
 */

/** How many passed cards the Deck shows as a pile: deeper ones stay at three. */
const MAX_DEPTH = 3;

/**
 * The study in view: the one whose position is nearest the scroll. At the end
 * of the range it is the last, whose position may lie past the end and so can
 * never be reached. When nothing scrolls, the nearest wins, so the first.
 */
export function nearestIndex(positions: number[], scroll: number, maxScroll: number): number {
  if (positions.length === 0) return 0;
  if (maxScroll > 0 && scroll >= maxScroll - 1) return positions.length - 1;
  let best = 0;
  for (let i = 1; i < positions.length; i++) {
    if (Math.abs(positions[i] - scroll) < Math.abs(positions[best] - scroll)) best = i;
  }
  return best;
}

/**
 * How many cards cover card `i`, up to MAX_DEPTH: each card after it counts
 * from 0 as it starts to slide over to 1 once it has arrived, so the pile
 * shrinks smoothly with the scroll. A position past the end of the range
 * counts as arriving at the end, so the last card fully covers the one before.
 */
export function coverDepth(positions: number[], scroll: number, maxScroll: number, i: number): number {
  const at = positions.map((p) => Math.min(p, Math.max(0, maxScroll)));
  let depth = 0;
  for (let k = i; k < at.length - 1; k++) {
    const span = at[k + 1] - at[k];
    if (span > 0) depth += Math.min(1, Math.max(0, (scroll - at[k]) / span));
  }
  return Math.min(MAX_DEPTH, depth);
}
