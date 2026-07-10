import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** vertical drift in percent, positive = moves down slower */
  speed?: number;
  /** initial overscale that settles to 1 */
  fromScale?: number;
  width?: number;
  height?: number;
  eager?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  speed = 12,
  fromScale = 1.08,
  width,
  height,
  eager = false,
}: ParallaxImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGsap(({ gsap }) => {
    if (!wrapRef.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: fromScale, yPercent: -speed / 2 },
        {
          scale: 1,
          yPercent: speed / 2,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [speed, fromScale]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  );
}
