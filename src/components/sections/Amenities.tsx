import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { TOWER } from "@/lib/tower-brand";
import pool from "@/assets/pool.jpg";
import dining from "@/assets/dining.jpg";
import spa from "@/assets/spa.jpg";
import lounge from "@/assets/lounge.jpg";
import residenceView from "@/assets/residence-view.jpg";

const CHAPTERS = [
  { id: "pool", word: "WATER", title: "Infinity Pool", img: pool, text: `An infinity edge suspended ${TOWER.heightM} metres above the city.`, effect: "pan" },
  { id: "dining", word: "TASTE", title: "Signature Dining", img: dining, text: "Two restaurants. One skyline.", effect: "static" },
  { id: "spa", word: "CALM", title: "Wellness & Spa", img: spa, text: "Thermal pools carved in warm stone.", effect: "static" },
  { id: "lounge", word: "QUIET", title: "Private Lounges", img: lounge, text: "Rooms that belong only to residents.", effect: "depth" },
  { id: "residences", word: "LIGHT", title: "Panoramic Residences", img: residenceView, text: "Corner glass. Morning haze. The city below.", effect: "depth2" },
];

/** Horizontal cinema controlled by vertical scroll. */
export function Amenities() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    if (!outerRef.current || !trackRef.current) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current!;
      const move = gsap.to(track, {
        xPercent: -100 * (CHAPTERS.length - 1) / CHAPTERS.length * 1.0,
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // per-chapter inner motion tied to the horizontal container animation
      const panels = track.querySelectorAll<HTMLElement>("[data-chapter]");
      panels.forEach((panel) => {
        const effect = panel.dataset.chapter;
        const img = panel.querySelector("img");
        const word = panel.querySelector("[data-word]");
        if (word) {
          gsap.fromTo(word, { xPercent: 24 }, {
            xPercent: -24, ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          });
        }
        if (!img) return;
        if (effect === "pan") {
          gsap.fromTo(img, { objectPosition: "30% 50%" }, {
            objectPosition: "70% 50%", ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          });
        } else if (effect !== "static") {
          gsap.fromTo(img, { scale: 1.15 }, {
            scale: 1, ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          });
        }
      });

      return () => move.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="life" aria-label={`Life at ${TOWER.heightM} metres`} className="bg-charcoal">
      <div className="px-6 pb-4 pt-28 md:px-24">
        <p className="tech-label text-ivory/50">04 — Life at {TOWER.heightM} Metres</p>
      </div>

      <div ref={outerRef} className="overflow-hidden">
        <div ref={trackRef} className="flex flex-col md:h-screen md:w-max md:flex-row">
          {CHAPTERS.map((c) => (
            <article
              key={c.id}
              data-chapter={c.effect}
              className="relative flex h-[62dvh] min-h-[22rem] w-full shrink-0 items-center justify-center overflow-hidden md:h-screen md:w-screen"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width={1920}
                  height={1080}
                  className="h-full w-full object-cover will-change-transform"
                />
              </div>
              <div className="absolute inset-0 bg-midnight/35" />

              <h3
                data-word
                aria-hidden="true"
                className="display-serif pointer-events-none relative z-10 select-none text-ivory/90 will-change-transform"
                style={{ fontSize: "clamp(5rem, 16vw, 17rem)", letterSpacing: "0.02em" }}
              >
                {c.word}
              </h3>

              <div className="absolute bottom-10 left-6 z-10 md:bottom-16 md:left-16">
                <p className="tech-label text-gold">{c.title}</p>
                <p className="mt-2 max-w-xs text-sm text-ivory/70">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
