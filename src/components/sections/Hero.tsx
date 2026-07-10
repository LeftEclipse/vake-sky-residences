import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, scrollToId } from "@/lib/gsapSetup";
import { MagneticButton } from "@/components/motion/MagneticButton";
import heroTower from "@/assets/hero-tower.jpg";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(rootRef);

    const ctx = gsap.context(() => {
      // ——— load sequence ———
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(imgRef.current, { scale: 1.18, filter: "brightness(0.1)" }, { scale: 1.08, filter: "brightness(1)", duration: 2.2, ease: "power2.out" })
        .fromTo(q("[data-hero-line]"), { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: "power4.inOut" }, "-=1.6")
        .fromTo(q("[data-hero-title] span span"), { yPercent: 118 }, { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.14 }, "-=1.0")
        .fromTo(q("[data-hero-label]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, "-=0.7");

      // ——— scroll parallax layers ———
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      scrub
        .fromTo(imgRef.current, { scale: 1.08 }, { scale: 1.0, yPercent: 6, ease: "none" }, 0)
        .to(q("[data-hero-title]"), { yPercent: -28, ease: "none" }, 0)
        .to(q("[data-hero-label]"), { yPercent: -85, ease: "none" }, 0)
        .to(q("[data-hero-line]"), { scaleY: 0.3, ease: "none" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className="sticky top-0 h-screen overflow-hidden bg-midnight">
      <img
        ref={imgRef}
        src={heroTower}
        alt="VR Vake Sky Tower rising above Tbilisi at dusk"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-[62%_20%] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-midnight/30" />

      {/* vertical architectural line */}
      <div
        data-hero-line
        className="absolute left-6 top-0 h-full w-px origin-top bg-ivory/25 md:left-24"
      />

      {/* title block — asymmetric lower left */}
      <h1
        data-hero-title
        className="display-serif absolute bottom-[16vh] left-6 z-10 text-ivory md:left-24"
        style={{ fontSize: "clamp(4.5rem, 13vw, 13rem)" }}
      >
        <span className="block overflow-hidden"><span className="block will-change-transform">VR</span></span>
        <span className="block overflow-hidden -mt-[0.12em]"><span className="block will-change-transform">VAKE</span></span>
        <span className="block overflow-hidden -mt-[0.12em]">
          <span className="block whitespace-nowrap italic will-change-transform" style={{ fontSize: "0.42em", letterSpacing: "0.04em" }}>
            Sky Tower
          </span>
        </span>
      </h1>

      {/* technical labels — opposing corner */}
      <div className="absolute bottom-[16vh] right-6 z-10 hidden flex-col items-end gap-5 text-ivory md:right-24 md:flex">
        <p data-hero-label className="tech-label">The Future of Urban Living</p>
        <p data-hero-label className="tech-label text-ivory/60">Tbilisi — Georgia</p>
        <p data-hero-label className="tech-label text-gold">260 M / 70 Floors / 843 Residences</p>
      </div>

      <p data-hero-label className="tech-label absolute bottom-8 left-6 z-10 text-ivory/60 md:left-24">
        Vake District
      </p>

      {/* circular explore */}
      <div className="absolute bottom-8 right-6 z-10 md:bottom-14 md:right-24">
        <MagneticButton
          onClick={() => scrollToId("landmark")}
          cursorLabel="EXPLORE"
          ariaLabel="Scroll to explore the tower"
          className="flex h-24 w-24 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors duration-500 hover:border-gold hover:text-gold md:h-28 md:w-28"
          strength={0.45}
        >
          <span data-hero-label className="tech-label">Explore</span>
        </MagneticButton>
      </div>
    </header>
  );
}
