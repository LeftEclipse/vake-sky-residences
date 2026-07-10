import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { scrollToId } from "@/lib/gsapSetup";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SEGMENTS } from "@/lib/tower-data";
import { TOWER } from "@/lib/tower-brand";
import aerialNight from "@/assets/aerial-night.jpg";

interface ResidencesHeroProps {
  onViewPrices: () => void;
}

export function ResidencesHero({ onViewPrices }: ResidencesHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGsap(({ gsap }) => {
    if (!rootRef.current) return;
    const q = gsap.utils.selector(rootRef);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        imgRef.current,
        { scale: 1.2, filter: "brightness(0.08)" },
        { scale: 1.06, filter: "brightness(1)", duration: 2.4, ease: "power2.out" },
      )
        .fromTo(
          q("[data-rh-line]"),
          { scaleY: 0 },
          { scaleY: 1, duration: 1.4, ease: "power4.inOut" },
          "-=1.8",
        )
        .fromTo(
          q("[data-rh-title] span span"),
          { yPercent: 120 },
          { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.12 },
          "-=1.0",
        )
        .fromTo(
          q("[data-rh-label]"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.7",
        )
        .fromTo(
          q("[data-rh-chip]"),
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "back.out(1.4)" },
          "-=0.4",
        )
        .fromTo(
          q("[data-rh-cta]"),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.3",
        );

      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      scrub
        .fromTo(imgRef.current, { scale: 1.06 }, { scale: 1.0, yPercent: 8, ease: "none" }, 0)
        .to(q("[data-rh-overlay]"), { opacity: 1, ease: "none" }, 0)
        .to(imgRef.current, { opacity: 0, ease: "none" }, 0.35)
        .to(q("[data-rh-content]"), { opacity: 0, yPercent: -18, ease: "none" }, 0)
        .to(q("[data-rh-line]"), { scaleY: 0.4, opacity: 0, ease: "none" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className="sticky top-0 z-0 h-screen overflow-hidden bg-midnight">
      <img
        ref={imgRef}
        src={aerialNight}
        alt={`Aerial view of ${TOWER.name}`}
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-midnight/25" />
      <div
        data-rh-overlay
        className="pointer-events-none absolute inset-0 z-20 bg-midnight opacity-0"
      />

      <div
        data-rh-line
        className="absolute left-6 top-0 h-full w-px origin-top bg-ivory/25 md:left-24"
      />

      <div
        data-rh-content
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 pt-36 md:px-24 md:pb-24"
      >
        <p data-rh-label className="tech-label text-ivory/60">
          Residences
        </p>

        <h1
          data-rh-title
          className="display-serif mt-6 max-w-4xl text-ivory"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          <span className="block overflow-hidden">
            <span className="block will-change-transform">Choose your</span>
          </span>
          <span className="block overflow-hidden -mt-[0.08em]">
            <span className="block will-change-transform">residence</span>
          </span>
          <span className="block overflow-hidden -mt-[0.08em]">
            <span className="block italic text-gold will-change-transform">above the city.</span>
          </span>
        </h1>

        <p data-rh-label className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/70">
          Explore all four collections, select a floor, and view the interactive floor plan.
          Compare layouts, orientations, and pricing across {TOWER.residences} residences.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {SEGMENTS.map((seg) => (
            <span
              key={seg.id}
              data-rh-chip
              className="tech-label border border-ivory/25 bg-midnight/50 px-4 py-2 backdrop-blur-sm"
            >
              {seg.name} · {seg.floors[0]}–{seg.floors[1]}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <div data-rh-cta>
            <MagneticButton
              onClick={onViewPrices}
              cursorLabel="SELECT"
              className="btn-fill-gold tech-label border border-gold px-10 py-4 text-ivory transition-colors duration-500 hover:text-midnight"
              strength={0.4}
            >
              View Price List
            </MagneticButton>
          </div>
          <div data-rh-cta>
            <MagneticButton
              onClick={() => scrollToId("selector")}
              cursorLabel="EXPLORE"
              className="btn-fill tech-label border border-ivory/40 px-10 py-4 text-ivory transition-colors duration-500 hover:text-midnight"
              strength={0.4}
            >
              Start Selecting
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  );
}
