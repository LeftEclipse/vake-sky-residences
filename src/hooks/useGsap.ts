import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/gsapSetup";

type GsapModule = typeof import("@/lib/gsap.client");

export function useGsap(
  setup: (mod: GsapModule) => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let cleanup: void | (() => void);
    let cancelled = false;

    import("@/lib/gsap.client").then((mod) => {
      if (cancelled) return;
      cleanup = setup(mod);
    });

    return () => {
      cancelled = true;
      if (typeof cleanup === "function") cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
