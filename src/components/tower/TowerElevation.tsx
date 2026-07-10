import { SEGMENTS, type Segment } from "@/lib/tower-data";
import { TOWER } from "@/lib/tower-brand";

/** floor → y coordinate in the 300×800 elevation viewBox */
export const floorY = (f: number) => 60 + (TOWER.floors - f) * 9;

interface TowerElevationProps {
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (seg: Segment) => void;
  highlightFloor?: number | null;
  activeSegment?: Segment | null;
}

export function TowerElevation({
  hovered,
  onHover,
  onSelect,
  highlightFloor,
  activeSegment,
}: TowerElevationProps) {
  return (
    <svg
      viewBox="0 0 300 800"
      className="h-full w-auto max-w-full"
      role="group"
      aria-label="Tower elevation — select a level"
    >
      <line x1="0" y1="762" x2="300" y2="762" stroke="oklch(0.929 0.012 85 / 0.25)" strokeWidth="1" />
      <line x1="150" y1="18" x2="150" y2="60" stroke="oklch(0.693 0.058 78)" strokeWidth="1.5" />
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
