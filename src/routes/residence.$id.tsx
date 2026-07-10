import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { parseResidenceId, segmentForFloor } from "@/lib/tower-data";
import { TOWER } from "@/lib/tower-brand";
import { useCompare } from "@/lib/compare";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/sections/Footer";
import { CompareBar } from "@/components/CompareBar";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { MagneticButton } from "@/components/motion/MagneticButton";
import interiorLiving from "@/assets/interior-living.jpg";
import terrace from "@/assets/terrace.jpg";
import residenceView from "@/assets/residence-view.jpg";
import panorama from "@/assets/panorama.jpg";

export const Route = createFileRoute("/residence/$id")({
  head: ({ params }) => {
    const r = parseResidenceId(params.id);
    const title = r
      ? `Residence ${r.floor}.${String(r.unit).padStart(2, "0")} — ${TOWER.name}`
      : `Residence — ${TOWER.name}`;
    const description = r
      ? `${r.bedrooms} bedroom residence, ${r.interior} m² interior, floor ${r.floor} of ${TOWER.name}, ${TOWER.city}.`
      : `Luxury residence at ${TOWER.name}, ${TOWER.city}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ResidenceDetail,
});

const ROOMS = [
  { id: "living", label: "LIVING", area: "48 m²", x: 40, y: 40, w: 420, h: 260 },
  { id: "kitchen", label: "KITCHEN", area: "22 m²", x: 40, y: 300, w: 220, h: 180 },
  { id: "master", label: "MASTER SUITE", area: "34 m²", x: 460, y: 40, w: 300, h: 220 },
  { id: "terrace", label: "TERRACE", area: "31 m²", x: 260, y: 300, w: 500, h: 180 },
];

function ResidenceDetail() {
  const { id } = Route.useParams();
  const residence = parseResidenceId(id);
  const { ids, toggle } = useCompare();
  const [room, setRoom] = useState<string | null>(null);

  if (!residence) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-midnight text-ivory">
        <p className="display-serif text-4xl">Residence not found.</p>
        <Link to="/" className="tech-label link-line mt-8 text-gold">
          Return to the tower
        </Link>
      </div>
    );
  }

  const num = `${residence.floor}.${String(residence.unit).padStart(2, "0")}`;
  const seg = segmentForFloor(residence.floor);
  const inCompare = ids.includes(id);

  return (
    <div className="bg-ivory text-charcoal">
      <CustomCursor />
      <Navigation />

      {/* editorial header */}
      <header className="relative bg-midnight px-6 pb-20 pt-36 text-ivory md:px-24 md:pb-28">
        <Link to="/" className="tech-label link-line text-ivory/60">
          ← The Tower
        </Link>
        <h1 className="display-serif mt-8" style={{ fontSize: "clamp(5rem, 16vw, 15rem)", lineHeight: 0.9 }}>
          {num}
        </h1>
        <div className="mt-10 grid grid-cols-2 gap-y-8 border-t border-ivory/15 pt-8 sm:grid-cols-5">
          {[
            ["Floor", String(residence.floor)],
            ["Interior", `${residence.interior} m²`],
            ["Terrace", `${residence.terrace} m²`],
            ["Bedrooms", String(residence.bedrooms)],
            ["Orientation", residence.orientation],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="tech-label text-ivory/50">{label}</p>
              <p className="display-serif mt-2 text-2xl md:text-3xl">{value}</p>
            </div>
          ))}
        </div>
        {seg && <p className="tech-label mt-8 text-gold">{seg.name}</p>}
      </header>

      {/* floor plan with animated room labels */}
      <section className="px-6 py-24 md:px-24" aria-label="Floor plan">
        <p className="tech-label text-charcoal/50">Floor Plan</p>
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
          <svg viewBox="0 0 800 520" className="w-full border border-charcoal/20 bg-stone/30">
            {ROOMS.map((r) => {
              const isHover = room === r.id;
              return (
                <g
                  key={r.id}
                  onMouseEnter={() => setRoom(r.id)}
                  onMouseLeave={() => setRoom(null)}
                  className="cursor-pointer"
                  data-cursor="VIEW"
                >
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    fill={isHover ? "oklch(0.693 0.058 78 / 0.18)" : "oklch(0.929 0.012 85)"}
                    stroke="oklch(0.235 0.006 258 / 0.4)"
                    strokeWidth="1.5"
                    style={{ transition: "fill 0.4s ease" }}
                  />
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2}
                    textAnchor="middle"
                    fontSize={isHover ? 15 : 12}
                    letterSpacing={isHover ? "6" : "3"}
                    className={isHover ? "fill-gold" : "fill-charcoal/60"}
                    style={{ transition: "all 0.4s ease" }}
                  >
                    {r.label}
                  </text>
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 22}
                    textAnchor="middle"
                    fontSize="11"
                    letterSpacing="2"
                    className="fill-charcoal/50"
                    style={{ opacity: isHover ? 1 : 0, transition: "opacity 0.4s ease" }}
                  >
                    {r.area}
                  </text>
                </g>
              );
            })}
            {/* terrace hatch */}
            <line x1="260" y1="480" x2="760" y2="480" stroke="oklch(0.693 0.058 78)" strokeWidth="3" />
          </svg>

          <div className="flex flex-col justify-center gap-6">
            <p className="text-sm leading-relaxed text-charcoal/60">
              A {residence.bedrooms}-bedroom residence of {residence.interior} m² with a {residence.terrace} m²
              terrace facing {residence.orientation.replace(" View", "").toLowerCase()}, approximately{" "}
              {residence.heightM} metres above the city.
            </p>
            <MagneticButton
              onClick={() => toggle(id)}
              cursorLabel="SELECT"
              className={`tech-label border px-8 py-4 transition-colors duration-500 ${
                inCompare
                  ? "border-gold bg-gold text-midnight"
                  : "btn-fill border-charcoal text-charcoal hover:text-ivory"
              }`}
            >
              {inCompare ? "Saved to Compare ✓" : "Save to Compare"}
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="grid grid-cols-1 gap-6 px-6 pb-24 md:grid-cols-12 md:px-24" aria-label="Gallery">
        <ParallaxImage
          src={interiorLiving}
          alt="Living space with panoramic glazing"
          width={1280}
          height={960}
          className="aspect-[4/3] md:col-span-7"
        />
        <ParallaxImage
          src={terrace}
          alt="Private terrace at golden hour"
          width={1024}
          height={1280}
          speed={-10}
          className="aspect-[3/4] md:col-span-5 md:mt-24"
        />
      </section>

      {/* view from floor */}
      <section className="relative h-[70vh] overflow-hidden" aria-label="View from this floor">
        <img
          src={residence.floor > 40 ? residenceView : panorama}
          alt={`Approximate view from floor ${residence.floor}`}
          loading="lazy"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-midnight/25" />
        <div className="absolute bottom-10 left-6 text-ivory md:left-24">
          <p className="tech-label text-gold">The View</p>
          <p className="display-serif mt-2 text-4xl md:text-6xl">
            ≈ {residence.heightM} m above Tbilisi
          </p>
        </div>
      </section>

      {/* specifications */}
      <section className="px-6 py-24 md:px-24" aria-label="Specifications">
        <p className="tech-label text-charcoal/50">Specifications</p>
        <div className="mt-8 divide-y divide-charcoal/15 border-y border-charcoal/15">
          {[
            ["Ceiling height", "3.1 m"],
            ["Glazing", "Floor-to-ceiling, triple glazed"],
            ["Climate", "Concealed VRF with fresh-air supply"],
            ["Delivery", "White frame or turnkey interior"],
            ["Parking", "Private underground allocation"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between py-5">
              <span className="tech-label text-charcoal/60">{k}</span>
              <span className="display-serif text-xl md:text-2xl">{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* enquiry CTA */}
      <section className="bg-midnight px-6 py-28 text-center text-ivory md:px-24">
        <p className="display-serif text-4xl md:text-6xl">
          Residence {num}, <span className="italic text-gold">privately presented.</span>
        </p>
        <Link
          to="/"
          hash="contact"
          className="btn-fill-gold tech-label mt-12 inline-block border border-gold px-12 py-5 text-ivory transition-colors duration-500 hover:text-midnight"
          data-cursor="SELECT"
        >
          Request Private Presentation
        </Link>
      </section>

      <Footer />
      <CompareBar />
    </div>
  );
}
