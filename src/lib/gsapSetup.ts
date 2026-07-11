export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

/** Lenis fights native touch momentum; use native scroll on touch devices. */
export const shouldUseSmoothScroll = () =>
  typeof window !== "undefined" &&
  !prefersReducedMotion() &&
  !isCoarsePointer();

declare global {
  interface Window {
    __lenis?: { scrollTo: (target: string | number | HTMLElement, opts?: object) => void };
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}
