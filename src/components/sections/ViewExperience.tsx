import { useState } from "react";
import { TOWER } from "@/lib/tower-brand";
import panorama from "@/assets/panorama.jpg";

/** Interactive "view from your floor" — vertical slider 01–max floor. */
export function ViewExperience() {
  const defaultFloor = Math.round(TOWER.floors * 0.75);
  const [floor, setFloor] = useState(defaultFloor);
  const t = (floor - 1) / (TOWER.floors - 1); // 0..1
  const height = Math.round(floor * TOWER.floorHeightM);

  return (
    <section id="view" className="relative flex min-h-screen flex-col overflow-hidden bg-midnight text-ivory" aria-labelledby="view-heading">
      <div className="z-10 px-6 pt-28 md:px-24">
        <p className="tech-label text-ivory/50">05 — The View</p>
        <h2 id="view-heading" className="display-serif mt-4 text-4xl md:text-6xl">
          The city, <span className="italic text-gold">from your floor.</span>
        </h2>
      </div>

      <div className="relative mt-10 flex flex-1 items-stretch">
        {/* panorama */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={panorama}
            alt={`View across Tbilisi from approximately ${height} metres`}
            loading="lazy"
            width={1920}
            height={1080}
            className="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
            style={{
              transform: `scale(${1.28 - t * 0.24}) translateY(${(1 - t) * 4}%)`,
            }}
          />
          {/* atmospheric haze decreases with height */}
          <div
            className="absolute inset-0 bg-stone transition-opacity duration-700"
            style={{ opacity: 0.55 * (1 - t) }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-midnight/60" />
        </div>

        {/* readout */}
        <div className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-16 md:px-24 md:pb-24">
          <p className="display-serif text-7xl md:text-[10rem]" style={{ lineHeight: 0.9 }}>
            <span className="tech-label mr-4 align-super text-ivory/60">Floor</span>
            {String(floor).padStart(2, "0")}
          </p>
          <p className="tech-label mt-4 text-gold">Approx. {height} m above Tbilisi</p>
        </div>

        {/* vertical slider */}
        <div className="relative z-10 flex w-24 flex-col items-center justify-center gap-6 pr-2 md:w-36 md:pr-10">
          <span className="tech-label text-ivory/50">{String(TOWER.floors).padStart(2, "0")}</span>
          <div className="flex h-[46vh] items-center">
            <input
              type="range"
              min={1}
              max={TOWER.floors}
              value={floor}
              onChange={(e) => setFloor(Number(e.target.value))}
              className="floor-slider h-[3px] w-[46vh] -rotate-90"
              aria-label="Choose a floor to preview the view"
              data-cursor="DRAG"
            />
          </div>
          <span className="tech-label text-ivory/50">01</span>
        </div>
      </div>
    </section>
  );
}
