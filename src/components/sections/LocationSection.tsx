import { useState } from "react";
import { TOWER } from "@/lib/tower-brand";
import aerialNight from "@/assets/aerial-night.jpg";

const PLACES = [
  { id: "lisi-lake", label: "Lisi Lake", time: "8 min", x: 180, y: 420 },
  { id: "universities", label: "Universities", time: "5 min", x: 560, y: 420 },
  { id: "centre", label: "City Centre", time: "14 min", x: 590, y: 240 },
  { id: "business", label: "Business District", time: "12 min", x: 660, y: 330 },
  { id: "culture", label: "Cultural Landmarks", time: "16 min", x: 310, y: 300 },
];

const TOWER_MARKER = { x: 400, y: 330 };

export function LocationSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="location" className="bg-midnight py-28 text-ivory md:py-40" aria-labelledby="location-heading">
      <div className="px-6 md:px-24">
        <p className="tech-label text-ivory/50">06 — Location</p>
        <h2 id="location-heading" className="display-serif mt-4 max-w-3xl text-4xl md:text-6xl">
          {TOWER.district}. A refined <span className="italic text-gold">address</span> in Tbilisi.
        </h2>
      </div>

      {/* stylised architectural map */}
      <div className="mt-16 px-6 md:px-24">
        <svg viewBox="0 0 800 560" className="w-full border border-ivory/10" role="group" aria-label="Stylised map of central Tbilisi">
          {/* abstract street grid */}
          <g stroke="oklch(0.929 0.012 85 / 0.08)" strokeWidth="1">
            {[80, 160, 240, 330, 410, 500].map((y) => (
              <path key={y} d={`M0 ${y} Q 400 ${y - 28}, 800 ${y + 22}`} fill="none" />
            ))}
            {[120, 260, 400, 540, 680].map((x) => (
              <path key={x} d={`M${x} 0 Q ${x + 30} 280, ${x - 20} 560`} fill="none" />
            ))}
          </g>
          {/* river */}
          <path d="M690 0 C 640 180, 720 330, 640 560" fill="none" stroke="oklch(0.38 0.045 262)" strokeWidth="14" opacity="0.7" />
          {/* park mass */}
          <ellipse cx="255" cy="360" rx="120" ry="80" fill="oklch(0.693 0.058 78 / 0.06)" stroke="oklch(0.693 0.058 78 / 0.2)" strokeWidth="1" />

          {/* connecting paths */}
          {PLACES.map((p) => (
            <line
              key={p.id}
              x1={TOWER_MARKER.x}
              y1={TOWER_MARKER.y}
              x2={p.x}
              y2={p.y}
              stroke="oklch(0.693 0.058 78)"
              strokeWidth="1"
              strokeDasharray="5 5"
              style={{
                opacity: active === p.id ? 1 : 0,
                strokeDashoffset: active === p.id ? 0 : 120,
                transition: "opacity 0.4s ease, stroke-dashoffset 1s ease",
              }}
            />
          ))}

          {/* tower marker */}
          <g>
            <rect x={TOWER_MARKER.x - 7} y={TOWER_MARKER.y - 7} width="14" height="14" fill="oklch(0.693 0.058 78)" transform={`rotate(45 ${TOWER_MARKER.x} ${TOWER_MARKER.y})`} />
            <text x={TOWER_MARKER.x} y={TOWER_MARKER.y - 20} textAnchor="middle" className="fill-ivory" fontSize="12" letterSpacing="3">
              {TOWER.nameUpper}
            </text>
          </g>

          {/* destinations */}
          {PLACES.map((p) => {
            const isActive = active === p.id;
            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onMouseEnter={() => setActive(p.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive((prev) => (prev === p.id ? null : p.id))}
                onFocus={() => setActive(p.id)}
                onBlur={() => setActive(null)}
                tabIndex={0}
                role="button"
                aria-label={`${p.label}, ${p.time} away`}
                aria-pressed={isActive}
                data-cursor="VIEW"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 9 : 4.5}
                  fill={isActive ? "oklch(0.693 0.058 78)" : "oklch(0.929 0.012 85 / 0.6)"}
                  style={{ transition: "all 0.4s ease" }}
                />
                <text x={p.x} y={p.y + 26} textAnchor="middle" className={isActive ? "fill-gold" : "fill-ivory/60"} fontSize="11" letterSpacing="2.5" style={{ transition: "fill 0.3s" }}>
                  {p.label.toUpperCase()}
                </text>
                <text x={p.x} y={p.y + 44} textAnchor="middle" className="fill-ivory" fontSize="10" letterSpacing="2" style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.3s" }}>
                  {p.time}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* cinematic aerial with floating labels */}
      <div className="relative mt-24 h-[50dvh] min-h-[18rem] overflow-hidden md:mx-24 md:h-[70dvh]">
        <img
          src={aerialNight}
          alt="Aerial dusk view of Tbilisi with the illuminated tower"
          loading="lazy"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-midnight/20" />
        <div className="absolute left-[46%] top-[12%]">
          <div className="h-16 w-px bg-gold/80" />
          <p className="tech-label mt-2 -translate-x-1/2 text-ivory">The Tower</p>
        </div>
        <div className="absolute left-[16%] top-[58%]">
          <div className="h-10 w-px bg-ivory/60" />
          <p className="tech-label mt-2 -translate-x-1/2 text-ivory/80">Old Town</p>
        </div>
        <div className="absolute right-[18%] top-[48%]">
          <div className="h-10 w-px bg-ivory/60" />
          <p className="tech-label mt-2 -translate-x-1/2 text-ivory/80">Mtatsminda</p>
        </div>
      </div>
    </section>
  );
}
