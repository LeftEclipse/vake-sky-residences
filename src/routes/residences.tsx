import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CompareBar } from "@/components/CompareBar";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { PriceList } from "@/components/residences/PriceList";
import { ResidenceExplorer } from "@/components/residences/ResidenceExplorer";
import { ResidencesHero } from "@/components/residences/ResidencesHero";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { useGsap } from "@/hooks/useGsap";
import { scrollToId } from "@/lib/gsapSetup";
import { TOWER } from "@/lib/tower-brand";

export const Route = createFileRoute("/residences")({
  head: () => ({
    meta: [
      { title: `Residences & Price List — ${TOWER.name}` },
      {
        name: "description",
        content:
          `Browse available residences at ${TOWER.name}. Select your floor, explore floor plans, and view pricing across all collections.`,
      },
      { property: "og:title", content: `Residences & Price List — ${TOWER.name}` },
      {
        property: "og:description",
        content:
          `Interactive residence selector and full price list for ${TOWER.name}, ${TOWER.city}.`,
      },
    ],
  }),
  component: ResidencesPage,
});

function ResidencesPage() {
  const ctaRef = useRef<HTMLElement>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const scrollToPrices = () => scrollToId("prices");

  useGsap(({ gsap }) => {
    if (!ctaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current!.querySelectorAll("[data-cta-item]"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ctaRef.current, start: "top 82%" },
        },
      );
    }, ctaRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-midnight text-ivory">
      <SmoothScroll />
      <CustomCursor />
      <Navigation variant="dark" />

      <ResidencesHero onViewPrices={scrollToPrices} />

      <main className="relative z-10">
        <div id="selector">
          <ResidenceExplorer
            onViewPrices={scrollToPrices}
            onResidenceSelect={setHighlightId}
          />
        </div>

        <PriceList highlightId={highlightId} />

        <section
          ref={ctaRef}
          className="bg-midnight px-6 py-28 text-center text-ivory md:px-24"
        >
          <div data-cta-item>
            <AnimatedText
              text="Ready for a private presentation?"
              as="p"
              className="display-serif text-4xl md:text-6xl"
              mode="words"
              stagger={0.08}
            />
          </div>
          <p data-cta-item className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ivory/60">
            Our sales atelier can arrange a personal viewing, detailed floor plans, and
            availability for your preferred residence.
          </p>
          <div data-cta-item className="mt-12">
            <Link
              to="/"
              hash="contact"
              className="btn-fill-gold tech-label inline-block border border-gold px-12 py-5 text-ivory transition-colors duration-500 hover:text-midnight"
              data-cursor="SELECT"
            >
              Request Private Presentation
            </Link>
          </div>
        </section>

        <Footer />
      </main>
      <CompareBar />
    </div>
  );
}
