const noop = () => {};

function timeline() {
  const tl = {
    fromTo: () => tl,
    to: () => tl,
  };
  return tl;
}

export const ScrollTrigger = {
  update: noop,
  create: noop,
  refresh: noop,
};

const gsap = {
  registerPlugin: noop,
  context: (fn: () => void) => {
    try {
      fn();
    } catch {
      // SSR stub — animations are client-only.
    }
    return { revert: noop };
  },
  timeline: timeline,
  fromTo: timeline,
  to: timeline,
  utils: {
    selector: () => () => [] as Element[],
  },
  matchMedia: () => ({
    add: noop,
  }),
  quickTo: () => noop,
  ticker: {
    add: noop,
    remove: noop,
    lagSmoothing: noop,
  },
};

export default gsap;
export { gsap };
