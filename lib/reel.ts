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

/** An element's edges on screen, in viewport pixels, as getBoundingClientRect gives them. */
export type Edges = { top: number; right: number; bottom: number; left: number };

/**
 * Whether a focused link is out of the reader's sight: the window cuts it off on
 * any side, or a later card, which lies on top of its own, starts above the
 * link's bottom edge. `covers` are the tops of the cards after the link's card
 * (none when the window runs sideways, where cards never overlap). A sub-pixel
 * overlap does not count.
 */
export function obscured(link: Edges, view: Edges, covers: number[]): boolean {
  const cut = link.top < view.top - 1 || link.bottom > view.bottom + 1 || link.left < view.left - 1 || link.right > view.right + 1;
  return cut || covers.some((top) => top < link.bottom - 1);
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
