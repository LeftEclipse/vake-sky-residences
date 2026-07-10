import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FloorSelector } from "@/components/tower/FloorSelector";
import { ResidencePlan } from "@/components/tower/ResidencePlan";
import { TowerElevation } from "@/components/tower/TowerElevation";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import {
  SEGMENTS,
  availableOnFloor,
  floorsOfSegment,
  type Segment,
} from "@/lib/tower-data";

type Stage = "tower" | "floors" | "plan";

const STEPS = [
  { key: "tower", label: "Collection" },
  { key: "floors", label: "Floor" },
  { key: "plan", label: "Residence" },
] as const;

interface ResidenceExplorerProps {
  onViewPrices?: () => void;
  onResidenceSelect?: (id: string) => void;
}

export function ResidenceExplorer({ onViewPrices, onResidenceSelect }: ResidenceExplorerProps) {
  const [stage, setStage] = useState<Stage>("tower");
  const [segment, setSegment] = useState<Segment | null>(null);
  const [floor, setFloor] = useState<number | null>(null);
  const [hoverSeg, setHoverSeg] = useState<string | null>(null);
  const [hoverFloor, setHoverFloor] = useState<number | null>(null);
  const navigate = useNavigate();
  const activeStep = stage === "tower" ? 0 : stage === "floors" ? 1 : 2;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current!.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!stageRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 48, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
      );
    }, stageRef);
    return () => ctx.revert();
  }, [stage, segment, floor]);

  const crumbs: { label: string; onClick?: () => void }[] = [
    {
      label: "Tower",
      onClick: () => {
        setStage("tower");
        setSegment(null);
        setFloor(null);
      },
    },
  ];
  if (segment) {
    crumbs.push({
      label: segment.name,
      onClick: () => {
        setStage("floors");
        setFloor(null);
      },
    });
  }
  if (floor != null) crumbs.push({ label: `Floor ${floor}` });

  const openResidence = (id: string) => {
    onResidenceSelect?.(id);
    navigate({ to: "/residence/$id", params: { id } });
  };

  return (
    <section
      ref={sectionRef}
      className="bg-midnight text-ivory"
      aria-labelledby="explorer-heading"
    >
      <div className="flex flex-col px-6 pb-24 pt-28 md:px-24">
        <div
          data-reveal
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="tech-label text-ivory/50">Interactive Residence Selector</p>
          {onViewPrices && (
            <MagneticButton
              onClick={onViewPrices}
              cursorLabel="SELECT"
              className="btn-fill-gold tech-label self-start border border-gold px-8 py-4 text-ivory transition-colors duration-500 hover:text-midnight"
              strength={0.35}
            >
              View Price List
            </MagneticButton>
          )}
        </div>

        <nav
          data-reveal
          aria-label="Selection steps"
          className="mt-8 flex flex-wrap items-center gap-4 md:gap-8"
        >
          {STEPS.map((step, index) => (
            <div key={step.key} className="flex items-center gap-4">
              {index > 0 && <span className="hidden h-px w-8 bg-ivory/20 md:block" />}
              <span
                className={`tech-label transition-colors duration-500 ${
                  index <= activeStep ? "text-gold" : "text-ivory/35"
                }`}
              >
                {String(index + 1).padStart(2, "0")} — {step.label}
              </span>
            </div>
          ))}
        </nav>

        <nav
          data-reveal
          aria-label="Selection path"
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-3">
              {i > 0 && <span className="h-px w-6 bg-gold/60" />}
              {c.onClick && i < crumbs.length - 1 ? (
                <button onClick={c.onClick} className="tech-label link-line text-gold">
                  {c.label}
                </button>
              ) : (
                <span className="tech-label text-ivory">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div ref={stageRef} className="will-change-transform">
          {stage === "tower" && (
            <div className="mt-10 grid flex-1 grid-cols-1 gap-12 lg:grid-cols-[55%_1fr]">
              <div className="flex h-[62vh] items-center justify-center lg:h-[72vh]">
                <TowerElevation
                  hovered={hoverSeg}
                  onHover={setHoverSeg}
                  onSelect={(seg) => {
                    setSegment(seg);
                    setStage("floors");
                  }}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 id="explorer-heading" className="display-serif text-4xl md:text-6xl">
                  <AnimatedText
                    text="Select a collection to begin."
                    as="span"
                    mode="words"
                    stagger={0.06}
                  />
                </h2>
                <div className="mt-10 space-y-0 border-t border-ivory/15">
                  {SEGMENTS.map((seg) => (
                    <button
                      key={seg.id}
                      className="group flex w-full items-baseline justify-between border-b border-ivory/15 py-5 text-left transition-colors duration-300 hover:bg-ivory/5"
                      onMouseEnter={() => setHoverSeg(seg.id)}
                      onMouseLeave={() => setHoverSeg(null)}
                      onClick={() => {
                        setSegment(seg);
                        setStage("floors");
                      }}
                      data-cursor="SELECT"
                    >
                      <span
                        className={`display-serif text-2xl transition-colors duration-300 md:text-3xl ${
                          hoverSeg === seg.id ? "text-gold" : ""
                        }`}
                      >
                        {seg.name}
                      </span>
                      <span className="tech-label text-ivory/50">
                        Floors {String(seg.floors[0]).padStart(2, "0")}–{seg.floors[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {stage === "floors" && segment && (
            <div className="mt-10 grid flex-1 grid-cols-1 gap-12 lg:grid-cols-[35%_1fr_30%]">
              <div className="hidden h-[68vh] items-center justify-center lg:flex">
                <TowerElevation
                  hovered={null}
                  onHover={() => {}}
                  onSelect={() => {}}
                  activeSegment={segment}
                  highlightFloor={hoverFloor ?? floor}
                />
              </div>
              <FloorSelector
                floors={floorsOfSegment(segment)}
                hoverFloor={hoverFloor}
                onHover={setHoverFloor}
                onSelect={(f) => {
                  setFloor(f);
                  setStage("plan");
                }}
              />
              <div className="flex flex-col justify-center border-l border-ivory/10 pl-8">
                <p className="tech-label text-ivory/50">{segment.name}</p>
                <p className="display-serif mt-4 text-7xl text-gold transition-all duration-500">
                  {hoverFloor != null ? String(hoverFloor).padStart(2, "0") : "—"}
                </p>
                <p className="tech-label mt-3 text-ivory/70">
                  {hoverFloor != null
                    ? `${availableOnFloor(hoverFloor)} residences available`
                    : "Select a floor"}
                </p>
                <p className="mt-8 max-w-xs text-sm leading-relaxed text-ivory/50">
                  {segment.description}
                </p>
              </div>
            </div>
          )}

          {stage === "plan" && floor != null && (
            <ResidencePlan
              floor={floor}
              onOpen={openResidence}
              onBack={() => {
                setStage("floors");
                setFloor(null);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
