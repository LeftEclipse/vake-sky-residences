import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/gsapSetup";

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: { on: (event: string, handler: () => void) => void; raf: (time: number) => void; destroy: () => void } | undefined;
    let tick: ((time: number) => void) | undefined;

    Promise.all([import("lenis"), import("@/lib/gsap.client")]).then(([lenisMod, gsapMod]) => {
      const Lenis = lenisMod.default;
      const { gsap, ScrollTrigger } = gsapMod;

      lenis = new Lenis({
        duration: 1.25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (tick) {
        import("@/lib/gsap.client").then(({ gsap }) => gsap.ticker.remove(tick!));
      }
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
