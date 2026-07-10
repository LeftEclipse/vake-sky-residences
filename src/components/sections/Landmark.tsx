import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { TOWER } from "@/lib/tower-brand";
import towerCutout from "@/assets/tower-cutout.png";

const STATS = [
  { id: "height", value: `${TOWER.heightM} M`, label: "Height", top: "18%", side: "left" },
  { id: "floors", value: String(TOWER.floors), label: "Floors", top: "38%", side: "right" },
  { id: "residences", value: String(TOWER.residences), label: "Residences", top: "58%", side: "left" },
  { id: "views", value: "Views", label: "Across Tbilisi", top: "76%", side: "right" },
] as const;

/** Pinned scroll chapter: the tower rises while day turns to midnight. */
export function Landmark() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!outerRef.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(stageRef);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
        },
      });

      // background: ivory → dusk → midnight
      tl.fromTo(stageRef.current, { backgroundColor: "oklch(0.929 0.012 85)" }, { backgroundColor: "oklch(0.38 0.045 262)", duration: 0.45, ease: "none" }, 0)
        .to(stageRef.current, { backgroundColor: "oklch(0.22 0.033 262)", duration: 0.45, ease: "none" }, 0.5);

      // tower rises
      tl.fromTo(q("[data-tower]"), { yPercent: 42, scale: 0.94 }, { yPercent: 0, scale: 1, duration: 1, ease: "none" }, 0);

      // giant height number drifting behind at a different speed
      tl.fromTo(q("[data-big-height]"), { yPercent: 60, opacity: 0 }, { yPercent: -6, opacity: 0.5, duration: 0.55, ease: "none" }, 0.3);

      // header fades to ivory text as bg darkens
      tl.to(q("[data-lm-head]"), { color: "oklch(0.929 0.012 85)", duration: 0.3, ease: "none" }, 0.35);

      // stats: each appears differently at its own moment
      // 1 — height: line extends then value clips up
      tl.fromTo(q("[data-stat-line='height']"), { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "none" }, 0.22)
        .fromTo(q("[data-stat='height']"), { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.08, ease: "none" }, 0.26);
      // 2 — floors: tracking spreads open
      tl.fromTo(q("[data-stat-line='floors']"), { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "none" }, 0.42)
        .fromTo(q("[data-stat='floors']"), { opacity: 0, letterSpacing: "0.6em" }, { opacity: 1, letterSpacing: "0.02em", duration: 0.1, ease: "none" }, 0.44);
      // 3 — residences: slides in horizontally
      tl.fromTo(q("[data-stat-line='residences']"), { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "none" }, 0.6)
        .fromTo(q("[data-stat='residences']"), { xPercent: -30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.1, ease: "none" }, 0.62);
      // 4 — views: soft scale settle
      tl.fromTo(q("[data-stat-line='views']"), { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "none" }, 0.78)
        .fromTo(q("[data-stat='views']"), { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1, ease: "none" }, 0.8);
    }, outerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="landmark" ref={outerRef} className="relative h-[420vh]">
      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen items-end justify-center overflow-hidden bg-ivory"
      >
        <p data-lm-head className="tech-label absolute left-6 top-24 text-charcoal md:left-24">
          01 — The Landmark
        </p>

        {/* oversized height behind the tower */}
        <div
          data-big-height
          aria-hidden="true"
          className="display-serif pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-gold/60"
          style={{ fontSize: "clamp(16rem, 42vw, 42rem)", lineHeight: 1 }}
        >
          {TOWER.heightM}
        </div>

        {/* the tower */}
        <img
          data-tower
          src={towerCutout}
          alt={`Architectural elevation of ${TOWER.name}`}
          width={768}
          height={1920}
          loading="lazy"
          className="relative z-10 h-[92vh] w-auto object-contain will-change-transform"
        />

        {/* stats pinned at heights */}
        {STATS.map((s) => (
          <div
            key={s.id}
            className={`absolute z-20 hidden md:block ${s.side === "left" ? "left-[8%] text-right" : "right-[8%] text-left"}`}
            style={{ top: s.top, width: "22%" }}
          >
            <div
              data-stat-line={s.id}
              className={`mb-3 h-px bg-gold/70 ${s.side === "left" ? "origin-right" : "origin-left"}`}
            />
            <div data-stat={s.id} className="text-ivory will-change-transform">
              <span className="display-serif block text-5xl lg:text-7xl">{s.value}</span>
              <span className="tech-label mt-2 block text-ivory/60">{s.label}</span>
            </div>
          </div>
        ))}

        {/* mobile stats strip */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-8 md:hidden">
          <div className="text-center text-ivory">
            <span className="display-serif block text-2xl">{TOWER.heightM} M</span>
            <span className="tech-label text-[9px] text-ivory/60">Height</span>
          </div>
          <div className="text-center text-ivory">
            <span className="display-serif block text-2xl">{TOWER.floors}</span>
            <span className="tech-label text-[9px] text-ivory/60">Floors</span>
          </div>
          <div className="text-center text-ivory">
            <span className="display-serif block text-2xl">{TOWER.residences}</span>
            <span className="tech-label text-[9px] text-ivory/60">Residences</span>
          </div>
        </div>
      </div>
    </div>
  );
}
