import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  SEGMENTS,
  type Segment,
  floorsOfSegment,
  availableOnFloor,
} from "@/lib/tower-data";
import { FloorSelector } from "@/components/tower/FloorSelector";
import { ResidencePlan } from "@/components/tower/ResidencePlan";

type Stage = "tower" | "floors" | "plan";

/** floor → y coordinate in the 300×800 elevation viewBox */
export const floorY = (f: number) => 60 + (70 - f) * 9;

function TowerElevation({
  hovered,
  onHover,
  onSelect,
  highlightFloor,
  activeSegment,
}: {
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (seg: Segment) => void;
  highlightFloor?: number | null;
  activeSegment?: Segment | null;
}) {
  return (
    <svg
      viewBox="0 0 300 800"
      className="h-full w-auto max-w-full"
      role="group"
      aria-label="Tower elevation — select a level"
    >
      {/* ground line */}
      <line x1="0" y1="762" x2="300" y2="762" stroke="oklch(0.929 0.012 85 / 0.25)" strokeWidth="1" />
      {/* spire */}
      <line x1="150" y1="18" x2="150" y2="60" stroke="oklch(0.693 0.058 78)" strokeWidth="1.5" />
      {/* podium */}
      <rect x="92" y="702" width="116" height="60" fill="oklch(0.929 0.012 85 / 0.08)" stroke="oklch(0.929 0.012 85 / 0.3)" strokeWidth="1" />
      <text x="222" y="738" className="fill-ivory/40" fontSize="9" letterSpacing="2">LOBBY · 01–05</text>

      {SEGMENTS.map((seg) => {
        const [lo, hi] = seg.floors;
        const y = floorY(hi);
        const h = floorY(lo) + 9 - y;
        const isHover = hovered === seg.id;
        const isActive = activeSegment?.id === seg.id;
        const dimmed = (hovered !== null && !isHover) || (activeSegment && !isActive);
        return (
          <g key={seg.id}>
            <rect
              x="108"
              y={y}
              width="84"
              height={h}
              fill={
                isHover || isActive
                  ? "oklch(0.693 0.058 78 / 0.55)"
                  : "oklch(0.929 0.012 85 / 0.1)"
              }
              stroke={isHover || isActive ? "oklch(0.693 0.058 78)" : "oklch(0.929 0.012 85 / 0.35)"}
              strokeWidth="1"
              opacity={dimmed ? 0.35 : 1}
              className="cursor-pointer transition-all duration-500"
              data-cursor="SELECT"
              tabIndex={0}
              role="button"
              aria-label={`${seg.name}, floors ${lo} to ${hi}`}
              onMouseEnter={() => onHover(seg.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onSelect(seg)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(seg)}
            />
            {/* floor ticks */}
            {Array.from({ length: Math.floor((hi - lo) / 4) + 1 }, (_, i) => lo + i * 4).map((f) => (
              <line
                key={f}
                x1="108"
                y1={floorY(f)}
                x2="192"
                y2={floorY(f)}
                stroke="oklch(0.929 0.012 85 / 0.12)"
                strokeWidth="0.5"
                pointerEvents="none"
              />
            ))}
            {/* guide line on hover */}
            {isHover && (
              <g pointerEvents="none">
                <line x1="192" y1={y + h / 2} x2="286" y2={y + h / 2} stroke="oklch(0.693 0.058 78)" strokeWidth="1" />
                <text x="286" y={y + h / 2 - 8} textAnchor="end" className="fill-ivory" fontSize="11" letterSpacing="2">
                  {String(lo).padStart(2, "0")}–{hi}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* highlighted floor band while choosing floors */}
      {highlightFloor != null && (
        <rect
          x="104"
          y={floorY(highlightFloor)}
          width="92"
          height="9"
          fill="oklch(0.693 0.058 78)"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}

export function TowerExplorer() {
  const [stage, setStage] = useState<Stage>("tower");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [floor, setFloor] = useState<number | null>(null);
  const [hoverSeg, setHoverSeg] = useState<string | null>(null);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const navigate = useNavigate();

  const crumbs: { label: string; onClick?: () => void }[] = [
    { label: "Tower", onClick: () => { setStage("tower"); setSegment(null); setFloor(null); } },
  ];
  if (segment) crumbs.push({ label: segment.name, onClick: () => { setStage("floors"); setFloor(null); } });
  if (floor != null) crumbs.push({ label: `Floor ${floor}` });

  return (
    <section id="explorer" className="relative min-h-screen bg-midnight text-ivory" aria-labelledby="explorer-heading">
      <div className="flex flex-col px-6 pb-24 pt-28 md:px-24">
        <p className="tech-label text-ivory/50">03 — Find Your Residence</p>

        {/* breadcrumbs */}
        <nav aria-label="Selection path" className="mt-6 flex flex-wrap items-center gap-3">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-3">
              {i > 0 && <span className="h-px w-6 bg-gold/60" />}
              {c.onClick && i < crumbs.length - 1 ? (
                <button onClick={c.onClick} className="tech-label link-line text-gold">
                  {c.label}
                </button>
              ) : (
                <span className="tech-label text-ivory">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {stage === "tower" && (
          <div className="mt-10 grid flex-1 grid-cols-1 gap-12 lg:grid-cols-[55%_1fr]">
            <div className="flex h-[62vh] items-center justify-center lg:h-[72vh]">
              <TowerElevation
                hovered={hoverSeg}
                onHover={setHoverSeg}
                onSelect={(seg) => { setSegment(seg); setStage("floors"); }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <h2 id="explorer-heading" className="display-serif text-4xl md:text-6xl">
                Select a level<br />
                <span className="italic text-gold">to explore.</span>
              </h2>
              <div className="mt-10 space-y-0 border-t border-ivory/15">
                {SEGMENTS.map((seg) => (
                  <button
                    key={seg.id}
                    className="group flex w-full items-baseline justify-between border-b border-ivory/15 py-5 text-left transition-colors duration-300 hover:bg-ivory/5"
                    onMouseEnter={() => setHoverSeg(seg.id)}
                    onMouseLeave={() => setHoverSeg(null)}
                    onClick={() => { setSegment(seg); setStage("floors"); }}
                    data-cursor="SELECT"
                  >
                    <span className={`display-serif text-2xl transition-colors duration-300 md:text-3xl ${hoverSeg === seg.id ? "text-gold" : ""}`}>
                      {seg.name}
                    </span>
                    <span className="tech-label text-ivory/50">
                      Floors {String(seg.floors[0]).padStart(2, "0")}–{seg.floors[1]}
                    </span>
                  </button>
                ))}
              </div>
              <p className="tech-label mt-8 text-ivory/40">Tower → Segment → Floor → Residence</p>
            </div>
          </div>
        )}

        {stage === "floors" && segment && (
          <div className="mt-10 grid flex-1 grid-cols-1 gap-12 lg:grid-cols-[35%_1fr_30%]">
            <div className="hidden h-[68vh] items-center justify-center lg:flex">
              <TowerElevation
                hovered={null}
                onHover={() => {}}
                onSelect={() => {}}
                activeSegment={segment}
                highlightFloor={hoverFloor ?? floor}
              />
            </div>
            <FloorSelector
              floors={floorsOfSegment(segment)}
              hoverFloor={hoverFloor}
              onHover={setHoverFloor}
              onSelect={(f) => { setFloor(f); setStage("plan"); }}
            />
            <div className="flex flex-col justify-center border-l border-ivory/10 pl-8">
              <p className="tech-label text-ivory/50">{segment.name}</p>
              <p className="display-serif mt-4 text-7xl text-gold">
                {hoverFloor != null ? String(hoverFloor).padStart(2, "0") : "—"}
              </p>
              <p className="tech-label mt-3 text-ivory/70">
                {hoverFloor != null
                  ? `${availableOnFloor(hoverFloor)} residences available`
                  : "Hover a floor"}
              </p>
              <p className="mt-8 max-w-xs text-sm leading-relaxed text-ivory/50">{segment.description}</p>
            </div>
          </div>
        )}

        {stage === "plan" && floor != null && (
          <ResidencePlan
            floor={floor}
            onOpen={(id) => navigate({ to: "/residence/$id", params: { id } })}
            onBack={() => { setStage("floors"); setFloor(null); }}
          />
        )}
      </div>
    </section>
  );
}
