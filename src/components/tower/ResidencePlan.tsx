import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { UNIT_LAYOUTS, getResidence, type Residence } from "@/lib/tower-data";

interface ResidencePlanProps {
  floor: number;
  onOpen: (id: string) => void;
  onBack: () => void;
}

const STATUS_FILL: Record<string, string> = {
  available: "oklch(0.851 0.013 82 / 0.28)",
  reserved: "oklch(0.851 0.013 82 / 0.1)",
  sold: "oklch(0.235 0.006 258 / 0.55)",
};

export function ResidencePlan({ floor, onOpen, onBack }: ResidencePlanProps) {
  const [hovered, setHovered] = useState<Residence | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    // entering the floor: plan scales from "inside the building"
    gsap.fromTo(
      rootRef.current.querySelector("[data-plan]"),
      { scale: 1.15, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" },
    );
  }, [floor]);

  const units = UNIT_LAYOUTS.map((_, i) => getResidence(floor, i));

  return (
    <div ref={rootRef} className="mt-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="display-serif text-3xl md:text-5xl">
            Floor <span className="text-gold">{String(floor).padStart(2, "0")}</span>
          </h3>
          <button onClick={onBack} className="tech-label link-line text-ivory/60">
            ← Floors
          </button>
        </div>

        <div data-plan className="relative mt-8 will-change-transform">
          <svg viewBox="0 0 800 500" className="w-full" role="group" aria-label={`Floor ${floor} plan — select a residence`}>
            {/* slab outline */}
            <rect x="10" y="10" width="780" height="480" fill="none" stroke="oklch(0.929 0.012 85 / 0.3)" strokeWidth="1.5" />
            {/* core */}
            <rect x="320" y="190" width="160" height="120" fill="oklch(0.929 0.012 85 / 0.06)" stroke="oklch(0.929 0.012 85 / 0.25)" strokeWidth="1" />
            <text x="400" y="255" textAnchor="middle" className="fill-ivory/35" fontSize="10" letterSpacing="3">CORE</text>

            {units.map((r, i) => {
              const layout = UNIT_LAYOUTS[i];
              const isHover = hovered?.unit === r.unit;
              const clickable = r.status === "available";
              return (
                <g key={r.id}>
                  <polygon
                    points={layout.points}
                    fill={isHover && clickable ? "oklch(0.693 0.058 78 / 0.45)" : STATUS_FILL[r.status]}
                    stroke={isHover ? "oklch(0.693 0.058 78)" : "oklch(0.929 0.012 85 / 0.35)"}
                    strokeWidth={isHover ? 1.5 : 1}
                    className={`transition-all duration-300 ${clickable ? "cursor-pointer" : "cursor-default"}`}
                    data-cursor={clickable ? "VIEW" : ""}
                    tabIndex={clickable ? 0 : -1}
                    role={clickable ? "button" : undefined}
                    aria-label={`Residence ${floor}.${String(r.unit).padStart(2, "0")}, ${r.status}`}
                    onMouseEnter={() => setHovered(r)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(r)}
                    onClick={() => clickable && onOpen(r.id)}
                    onKeyDown={(e) => e.key === "Enter" && clickable && onOpen(r.id)}
                  />
                  <text
                    x={layout.labelX}
                    y={layout.labelY}
                    textAnchor="middle"
                    pointerEvents="none"
                    className={r.status === "sold" ? "fill-ivory/25" : "fill-ivory/70"}
                    fontSize="13"
                    letterSpacing="2"
                  >
                    {floor}.{String(r.unit).padStart(2, "0")}
                  </text>
                  {r.status !== "available" && (
                    <text
                      x={layout.labelX}
                      y={layout.labelY + 18}
                      textAnchor="middle"
                      pointerEvents="none"
                      className="fill-ivory/30"
                      fontSize="8"
                      letterSpacing="2.5"
                    >
                      {r.status.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* floating editorial panel */}
          {hovered && (
            <div className="pointer-events-none absolute right-4 top-4 hidden w-64 border border-gold/40 bg-midnight/90 p-6 backdrop-blur-sm md:block">
              <p className="tech-label text-gold">Residence {floor}.{String(hovered.unit).padStart(2, "0")}</p>
              <p className="display-serif mt-3 text-2xl text-ivory">{hovered.bedrooms} Bedroom{hovered.bedrooms > 1 ? "s" : ""}</p>
              <div className="mt-4 space-y-1.5 text-xs text-ivory/70">
                <p>{hovered.interior} m² Interior</p>
                <p>{hovered.terrace} m² Terrace</p>
                <p>Floor {hovered.floor}</p>
                <p>{hovered.orientation}</p>
              </div>
              <p className="tech-label mt-5 text-ivory/50">
                {hovered.status === "available" ? "Explore residence →" : hovered.status}
              </p>
            </div>
          )}
        </div>

        {/* legend */}
        <div className="mt-6 flex gap-8">
          {(["available", "reserved", "sold"] as const).map((s) => (
            <span key={s} className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 border border-ivory/40" style={{ background: STATUS_FILL[s] }} />
              <span className="tech-label text-ivory/50">{s}</span>
            </span>
          ))}
        </div>
      </div>

      {/* mobile / side detail */}
      <div className="flex flex-col justify-center border-t border-ivory/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        {hovered ? (
          <div>
            <p className="tech-label text-gold">Residence {floor}.{String(hovered.unit).padStart(2, "0")}</p>
            <p className="display-serif mt-3 text-4xl">{hovered.interior} m²</p>
            <p className="mt-2 text-sm text-ivory/60">
              {hovered.bedrooms} bed · {hovered.terrace} m² terrace · {hovered.orientation}
            </p>
            {hovered.status === "available" && (
              <button
                onClick={() => onOpen(hovered.id)}
                className="btn-fill-gold tech-label mt-8 border border-gold px-8 py-4 text-ivory transition-colors duration-500 hover:text-midnight"
                data-cursor="VIEW"
              >
                Explore Residence
              </button>
            )}
          </div>
        ) : (
          <p className="tech-label leading-loose text-ivory/40">
            Hover a residence<br />on the floor plan
          </p>
        )}
      </div>
    </div>
  );
}
