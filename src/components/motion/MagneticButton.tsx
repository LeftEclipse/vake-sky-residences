import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap, prefersReducedMotion, isCoarsePointer } from "@/lib/gsapSetup";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
  cursorLabel?: string;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  onClick,
  type = "button",
  cursorLabel,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: MouseEvent) => {
    if (!ref.current || prefersReducedMotion() || isCoarsePointer()) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor={cursorLabel}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
