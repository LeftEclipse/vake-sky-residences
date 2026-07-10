import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import { AnimatedText } from "@/components/motion/AnimatedText";

const FACTS = [
  { value: 160000, suffix: " m²", label: "Project Scale", note: "Total constructed area" },
  { value: 4, prefix: "1–", suffix: "", label: "Residence Types", note: "One to four bedrooms" },
  { value: 2029, suffix: "", label: "Expected Completion", note: "Phased handover" },
  { value: null, text: "Freehold", label: "Ownership", note: "Full private title for international buyers" },
] as const;

export function Investment() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      ref.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("en-US").replace(/,/g, " ");
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-ivory py-32 text-charcoal md:py-48" aria-labelledby="investment-heading">
      <div className="px-6 md:px-24">
        <p className="tech-label text-charcoal/50">07 — Investment</p>
        <h2 id="investment-heading" className="display-serif mt-6" style={{ fontSize: "clamp(2.8rem, 7vw, 7rem)" }}>
          <AnimatedText text="AN ADDRESS" as="span" className="block" />
          <AnimatedText text="DESIGNED TO ENDURE." as="span" className="block italic text-gold" delay={0.12} />
        </h2>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-y-16 border-t border-charcoal/15 px-6 pt-16 sm:grid-cols-2 lg:grid-cols-4 md:px-24">
        {FACTS.map((f) => (
          <div key={f.label} className="border-l border-charcoal/15 pl-6">
            <p className="display-serif text-5xl md:text-6xl">
              {"prefix" in f && f.prefix}
              {f.value !== null ? (
                <span data-count={f.value}>0</span>
              ) : (
                <span className="italic">{f.text}</span>
              )}
              {"suffix" in f && f.suffix}
            </p>
            <p className="tech-label mt-4 text-gold">{f.label}</p>
            <p className="mt-2 text-sm text-charcoal/55">{f.note}</p>
          </div>
        ))}
      </div>

      <p className="tech-label mt-20 px-6 text-charcoal/40 md:px-24">
        Details indicative — confirmed in private presentation
      </p>
    </section>
  );
}
