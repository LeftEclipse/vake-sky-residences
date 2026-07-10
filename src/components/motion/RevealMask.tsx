import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";

interface RevealMaskProps {
  children: ReactNode;
  className?: string;
  /** direction of the clip-path reveal */
  direction?: "up" | "left" | "center";
  delay?: number;
}

/** Clip-path reveal of arbitrary content on scroll. */
export function RevealMask({ children, className = "", direction = "up", delay = 0 }: RevealMaskProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(({ gsap }) => {
    if (!ref.current) return;
    const from =
      direction === "up"
        ? "inset(100% 0% 0% 0%)"
        : direction === "left"
          ? "inset(0% 100% 0% 0%)"
          : "inset(0% 50% 0% 50%)";
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { clipPath: from },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          delay,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [direction, delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: "clip-path" }}>
      {children}
    </div>
  );
}
