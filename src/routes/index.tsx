import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { Landmark } from "@/components/sections/Landmark";
import { VerticalCity } from "@/components/sections/VerticalCity";
import { TowerExplorer } from "@/components/sections/TowerExplorer";
import { Amenities } from "@/components/sections/Amenities";
import { ViewExperience } from "@/components/sections/ViewExperience";
import { LocationSection } from "@/components/sections/LocationSection";
import { Investment } from "@/components/sections/Investment";
import { Enquiry } from "@/components/sections/Enquiry";
import { Footer } from "@/components/sections/Footer";
import { CompareBar } from "@/components/CompareBar";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <Navigation />
      <Hero />
      <main className="relative z-10">
        <Landmark />
        <VerticalCity />
        <TowerExplorer />
        <Amenities />
        <ViewExperience />
        <LocationSection />
        <Investment />
        <Enquiry />
        <Footer />
      </main>
      <CompareBar />
    </>
  );
}
