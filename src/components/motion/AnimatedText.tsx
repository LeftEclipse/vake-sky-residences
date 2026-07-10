import { useEffect, useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";

interface AnimatedTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** split by word (default) or line (whole string as one mask) */
  mode?: "words" | "line";
}

/** Masked rise-in text, triggered on scroll. */
export function AnimatedText({
  text,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger = 0.05,
  mode = "words",
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const targets = ref.current.querySelectorAll<HTMLElement>("[data-at-inner]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          delay,
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, stagger, text]);

  const pieces = mode === "line" ? [text] : text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {pieces.map((piece, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
          <span data-at-inner className="inline-block will-change-transform">
            {piece}
            {mode === "words" && i < pieces.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
