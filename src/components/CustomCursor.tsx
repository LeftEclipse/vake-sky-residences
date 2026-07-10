import { useEffect, useRef, useState } from "react";
import { isCoarsePointer, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Minimal circular cursor that follows the pointer.
 * Elements opt in with data-cursor="VIEW|EXPLORE|SELECT|DRAG".
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    let cleanup: (() => void) | undefined;

    import("@/lib/gsap.client").then(({ gsap }) => {
      const el = ref.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const over = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
        const label = target?.dataset.cursor ?? "";
        if (labelRef.current) labelRef.current.textContent = label;
        gsap.to(el, {
          width: label ? 84 : 12,
          height: label ? 84 : 12,
          backgroundColor: label ? "oklch(0.693 0.058 78 / 0.92)" : "oklch(0.693 0.058 78 / 0.9)",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(labelRef.current, { opacity: label ? 1 : 0, duration: 0.25 });
      };

      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerover", over, { passive: true });
      cleanup = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
      };
    });

    return () => cleanup?.();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full mix-blend-normal"
      style={{ background: "oklch(0.693 0.058 78 / 0.9)" }}
    >
      <span
        ref={labelRef}
        className="tech-label select-none text-[10px] text-midnight opacity-0"
        style={{ letterSpacing: "0.2em" }}
      />
    </div>
  );
}
