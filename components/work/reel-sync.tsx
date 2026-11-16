"use client";

import { useEffect } from "react";
import { coverDepth, nearestIndex, obscured } from "@/lib/reel";

/** Where the window turns from sideways to up and down: lg, as in globals.css. */
const VERTICAL = "(min-width: 64rem)";

/**
 * Keeps the reel (components/work/work-reel.tsx) in step with its window. It
 * renders nothing: it sets attributes and globals.css does the rest, as
 * HeroCycle and InView do. Once mounted it marks the root data-reel-ready,
 * which turns on the Deck; marks the study in view with aria-current on its
 * guide row and story segment; slides the guide's marker to that row
 * (--marker-top, --marker-height, --tint); and gives each card its --depth,
 * how many cards cover it, which scales the pile.
 *
 * A row or segment scrolls only the window to its study, smoothly unless the
 * reader asks for reduced motion; the page stays put and the URL is left as it
 * is. Picked from the keyboard, it also takes focus to that card's title.
 * Focus landing on a link the window cuts off or another card covers brings
 * that card forward, so a focused link is never left out of sight; a link in
 * plain view, or focus coming back as the reader returns to the tab, leaves
 * the window where it is. Positions are read from the zero-height
 * sentinels before each card, never from the cards: a stuck card's own offset
 * moves with the scroll. `scroll` drives everything; `scrollend` only adds a
 * last check where the browser has it.
 */
export function ReelSync() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-reel]");
    const win = root?.querySelector<HTMLElement>("[data-reel-window]");
    if (!root || !win) return;
    const snaps = [...win.querySelectorAll<HTMLElement>("[data-reel-snap]")];
    const cards = [...win.querySelectorAll<HTMLElement>(":scope > article")];
    const items = [...root.querySelectorAll<HTMLElement>("[data-reel-go]")];
    const marker = root.querySelector<HTMLElement>("[data-reel-marker]");
    if (snaps.length === 0) return;
    const vertical = window.matchMedia(VERTICAL);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const offset = (el: HTMLElement) => (vertical.matches ? el.offsetTop : el.offsetLeft);
    const positions = () => snaps.map((s) => offset(s) - offset(snaps[0]));
    const scrolled = () => (vertical.matches ? win.scrollTop : win.scrollLeft);
    const range = () => (vertical.matches ? win.scrollHeight - win.clientHeight : win.scrollWidth - win.clientWidth);
    const show = (i: number, behavior: ScrollBehavior) =>
      win.scrollTo({ [vertical.matches ? "top" : "left"]: positions()[i], behavior });
    const motion = (): ScrollBehavior => (reduced.matches ? "instant" : "smooth");

    let active = -1;
    let axis = vertical.matches;
    let frame = 0;
    // A resize asks for the marker to be measured again even if the study in view stays the same.
    let remeasure = false;

    const sync = (force: boolean) => {
      // Crossing lg turns the window's axis and resets its scroll: bring the same study back.
      if (vertical.matches !== axis) {
        axis = vertical.matches;
        if (active >= 0) show(active, "instant");
        force = true;
      }
      const at = positions();
      const scroll = scrolled();
      const max = range();
      const i = nearestIndex(at, scroll, max);
      const moved = force || i !== active;
      const row = moved ? root.querySelector<HTMLElement>(`[data-reel-guide] [data-reel-go="${i}"]`) : null;
      const top = row?.offsetTop ?? 0;
      const height = row?.offsetHeight ?? 0;

      cards.forEach((card, n) =>
        card.style.setProperty("--depth", vertical.matches ? coverDepth(at, scroll, max, n).toFixed(3) : "0"),
      );
      if (!moved) return;
      active = i;
      for (const item of items) {
        if (item.dataset.reelGo === String(i)) item.setAttribute("aria-current", "true");
        else item.removeAttribute("aria-current");
      }
      if (marker && row) {
        marker.style.setProperty("--marker-top", `${top}px`);
        marker.style.setProperty("--marker-height", `${height}px`);
        marker.style.setProperty("--tint", row.style.getPropertyValue("--tint"));
      }
    };

    const schedule = (force = false) => {
      remeasure ||= force;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const force = remeasure;
        remeasure = false;
        sync(force);
      });
    };
    const onScroll = () => schedule();
    const onResize = () => schedule(true);
    const onClick = (e: MouseEvent) => {
      const item = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-reel-go]") : null;
      if (!item || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const i = Number(item.dataset.reelGo);
      show(i, motion());
      // A click from the keyboard (no pointer, so no click count) takes focus to the card's title, as the plain
      // in-page link would, so the next Tab goes on inside that card. The window is already on its way there.
      if (e.detail === 0) cards[i]?.querySelector<HTMLElement>("h3 a")?.focus({ preventScroll: true });
    };
    // The element focused when the page lost focus, which gets it back, unasked, when the reader returns to the tab.
    let left: Element | null = null;
    const onPageBlur = () => {
      left = document.activeElement;
    };
    const onFocus = (e: FocusEvent) => {
      const returning = e.target === left;
      left = null;
      const link = e.target instanceof HTMLElement ? e.target : null;
      const card = link?.closest<HTMLElement>("article");
      const i = card ? cards.indexOf(card) : -1;
      if (!link || i < 0 || returning) return;
      // Only a link the window cuts off or a later card covers brings its card forward; one in plain view leaves the
      // window where the reader put it.
      const covers = vertical.matches ? cards.slice(i + 1).map((c) => c.getBoundingClientRect().top) : [];
      if (!obscured(link.getBoundingClientRect(), win.getBoundingClientRect(), covers)) return;
      // After the browser's own scroll to the focused element, which would otherwise cut this one short.
      requestAnimationFrame(() => show(i, motion()));
    };

    // The marker lands on its first row while still hidden, so nothing glides in at load.
    sync(true);
    root.dataset.reelReady = "";

    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("scrollend", onScroll);
    win.addEventListener("focusin", onFocus);
    root.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onPageBlur);
    // A web font arriving late can change the rows' heights.
    let live = true;
    document.fonts.ready.then(() => live && schedule(true));

    return () => {
      live = false;
      cancelAnimationFrame(frame);
      win.removeEventListener("scroll", onScroll);
      win.removeEventListener("scrollend", onScroll);
      win.removeEventListener("focusin", onFocus);
      root.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onPageBlur);
      delete root.dataset.reelReady;
      for (const item of items) item.removeAttribute("aria-current");
    };
  }, []);

  return null;
}
