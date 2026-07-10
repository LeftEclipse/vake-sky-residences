import { useState } from "react";
import { TOWER } from "@/lib/tower-brand";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import interiorLiving from "@/assets/interior-living.jpg";
import business from "@/assets/business.jpg";
import dining from "@/assets/dining.jpg";
import spa from "@/assets/spa.jpg";
import pool from "@/assets/pool.jpg";
import facadeDetail from "@/assets/facade-detail.jpg";
import lobby from "@/assets/lobby.jpg";

const LAYERS = [
  { id: "residences", label: "Residences", img: interiorLiving, desc: `${TOWER.residences} homes from one to four bedrooms, floors ${TOWER.minFloor} to ${TOWER.floors}.` },
  { id: "business", label: "Business", img: business, desc: "Private offices and meeting suites on dedicated levels." },
  { id: "dining", label: "Dining", img: dining, desc: "Signature restaurants with the city at your feet." },
  { id: "wellness", label: "Wellness", img: spa, desc: "Spa, thermal pools and a private training club." },
  { id: "skypool", label: "Sky Pool", img: pool, desc: `An infinity edge, ${TOWER.heightM} metres above Tbilisi.` },
];

export function VerticalCity() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative bg-ivory py-32 md:py-48" aria-labelledby="vertical-city-heading">
      <p className="tech-label mb-14 px-6 text-charcoal/60 md:px-24">02 — A New Vertical City</p>

      <div className="px-6 md:px-24">
        <h2 id="vertical-city-heading" className="display-serif max-w-6xl text-charcoal" style={{ fontSize: "clamp(2.8rem, 7.5vw, 7.5rem)" }}>
          <AnimatedText text="NOT JUST A TOWER." as="span" className="block" />
          <AnimatedText text="A CITY ABOVE THE CITY." as="span" className="block italic text-gold" delay={0.15} />
        </h2>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-16 px-6 md:mt-36 md:grid-cols-12 md:px-24">
        {/* sticky main image, swaps on hover */}
        <div className="relative md:col-span-6">
          <div className="sticky top-28 aspect-[4/3] overflow-hidden">
            {LAYERS.map((l, i) => (
              <img
                key={l.id}
                src={l.img}
                alt={l.label}
                width={1280}
                height={960}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
                style={{ opacity: active === i ? 1 : 0 }}
              />
            ))}
            <p className="tech-label absolute bottom-4 left-4 z-10 bg-midnight/70 px-3 py-2 text-ivory">
              {LAYERS[active].label}
            </p>
          </div>
        </div>

        {/* vertical timeline list */}
        <div className="md:col-span-5 md:col-start-8">
          <div className="border-l border-charcoal/20 pl-8 md:pl-14">
            {LAYERS.map((l, i) => (
              <div
                key={l.id}
                className="group relative border-b border-charcoal/10 py-7 first:pt-0 last:border-b-0"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="absolute -left-8 top-1/2 h-px w-5 bg-gold transition-all duration-500 group-hover:w-8 md:-left-14 md:w-8 md:group-hover:w-11" />
                <button
                  className="display-serif block text-left text-3xl text-charcoal transition-all duration-500 group-hover:translate-x-2 group-hover:text-gold md:text-5xl"
                  data-cursor="VIEW"
                  onClick={() => setActive(i)}
                >
                  {l.label.toUpperCase()}
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: active === i ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-sm pt-3 text-sm leading-relaxed text-charcoal/60">{l.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* drifting satellite images at different parallax depths */}
      <div className="pointer-events-none relative mt-28 hidden h-[60vh] md:block">
        <ParallaxImage
          src={facadeDetail}
          alt="Facade detail at dusk"
          width={1024}
          height={1280}
          speed={22}
          className="absolute left-[12%] top-0 w-[22vw] max-w-sm"
        />
        <ParallaxImage
          src={lobby}
          alt="Ivory stone lobby"
          width={1280}
          height={960}
          speed={-14}
          className="absolute right-[14%] top-[16%] w-[30vw] max-w-lg"
        />
        <p className="tech-label absolute bottom-6 left-1/2 -translate-x-1/2 text-charcoal/50">
          Architecture — Facade & Arrival
        </p>
      </div>
    </section>
  );
}
