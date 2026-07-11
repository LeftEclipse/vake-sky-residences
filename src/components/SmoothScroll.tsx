import { useEffect } from "react";
import { shouldUseSmoothScroll } from "@/lib/gsapSetup";

export function SmoothScroll() {
  useEffect(() => {
    let lenis: { on: (event: string, handler: () => void) => void; raf: (time: number) => void; destroy: () => void } | undefined;
    let tick: ((time: number) => void) | undefined;
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        import("@/lib/gsap.client").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
      }, 150);
    };

    import("@/lib/gsap.client").then(({ ScrollTrigger }) => {
      if (cancelled) return;
      ScrollTrigger.config({ ignoreMobileResize: true });
      window.visualViewport?.addEventListener("resize", scheduleRefresh);
      window.addEventListener("orientationchange", scheduleRefresh);
    });

    if (shouldUseSmoothScroll()) {
      Promise.all([import("lenis"), import("@/lib/gsap.client")]).then(([lenisMod, gsapMod]) => {
        if (cancelled) return;
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
    }

    return () => {
      cancelled = true;
      clearTimeout(refreshTimer);
      window.visualViewport?.removeEventListener("resize", scheduleRefresh);
      window.removeEventListener("orientationchange", scheduleRefresh);
      if (tick) {
        import("@/lib/gsap.client").then(({ gsap }) => gsap.ticker.remove(tick!));
      }
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}
