import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { availableOnFloor } from "@/lib/tower-data";

interface FloorSelectorProps {
  floors: number[];
  hoverFloor: number | null;
  onHover: (f: number | null) => void;
  onSelect: (f: number) => void;
}

export function FloorSelector({ floors, hoverFloor, onHover, onSelect }: FloorSelectorProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const rows = ref.current.querySelectorAll("[data-floor-row]");
    gsap.fromTo(
      rows,
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.03 },
    );
  }, [floors]);

  return (
    <div ref={ref} className="max-h-[68vh] overflow-y-auto pr-4" role="listbox" aria-label="Select a floor">
      {floors.map((f) => {
        const avail = availableOnFloor(f);
        const none = avail === 0;
        return (
          <button
            key={f}
            data-floor-row
            role="option"
            aria-selected={hoverFloor === f}
            disabled={none}
            className={`group flex w-full items-baseline justify-between border-b border-ivory/10 py-4 text-left transition-colors duration-300 ${
              none ? "opacity-30" : "hover:bg-ivory/5"
            }`}
            onMouseEnter={() => onHover(f)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(f)}
            onClick={() => !none && onSelect(f)}
            data-cursor={none ? "" : "SELECT"}
          >
            <span
              className={`display-serif text-3xl transition-all duration-300 md:text-4xl ${
                hoverFloor === f ? "translate-x-3 text-gold" : "text-ivory"
              }`}
            >
              {String(f).padStart(2, "0")}
            </span>
            <span className="tech-label text-ivory/40 group-hover:text-ivory/70">
              {none ? "Fully reserved" : `${avail} available`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
