import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { gsap, prefersReducedMotion, scrollToId } from "@/lib/gsapSetup";
import { TOWER } from "@/lib/tower-brand";

const LINKS = [
  { id: "landmark", label: "The Tower", href: "/" as const, hash: "landmark" as const },
  { id: "residences", label: "Residences", href: "/residences" as const },
  { id: "life", label: "Amenities", href: "/" as const, hash: "life" as const },
  { id: "location", label: "Location", href: "/" as const, hash: "location" as const },
  { id: "contact", label: "Enquire", href: "/" as const, hash: "contact" as const },
];

type NavigationProps = {
  variant?: "blend" | "dark";
};

export function Navigation({ variant = "blend" }: NavigationProps) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const items = ref.current.querySelectorAll("[data-nav-item]");
    gsap.fromTo(
      items,
      { yPercent: -130, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.07, delay: 0.9 },
    );
  }, []);

  const go = (hash?: string) => {
    setOpen(false);
    if (hash && onHome) scrollToId(hash);
  };

  const navClass =
    variant === "dark"
      ? "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 py-6 text-ivory md:px-12"
      : "pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 py-6 text-ivory mix-blend-difference md:px-12";

  return (
    <nav ref={ref} className={navClass} aria-label="Main navigation">
      <div data-nav-item className="pointer-events-auto overflow-hidden">
        <Link to="/" className="tech-label text-ivory" data-cursor="">
          {TOWER.nameNav}
        </Link>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <div key={l.id} data-nav-item className="pointer-events-auto overflow-hidden">
            {l.href === "/residences" ? (
              <Link to="/residences" className="tech-label link-line text-ivory">
                {l.label}
              </Link>
            ) : onHome && l.hash ? (
              <button onClick={() => go(l.hash)} className="tech-label link-line text-ivory">
                {l.label}
              </button>
            ) : (
              <Link to={l.href} hash={l.hash} className="tech-label link-line text-ivory">
                {l.label}
              </Link>
            )}
          </div>
        ))}
      </div>

      <button
        data-nav-item
        className="tech-label pointer-events-auto text-ivory md:hidden"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <div className="pointer-events-auto absolute inset-x-0 top-0 flex h-screen flex-col justify-center gap-8 bg-midnight px-8 md:hidden">
          <button
            className="tech-label absolute right-6 top-7 text-ivory"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          {LINKS.map((l) =>
            l.href === "/residences" ? (
              <Link
                key={l.id}
                to="/residences"
                onClick={() => setOpen(false)}
                className="display-serif text-left text-4xl text-ivory"
              >
                {l.label}
              </Link>
            ) : onHome && l.hash ? (
              <button
                key={l.id}
                onClick={() => go(l.hash)}
                className="display-serif text-left text-4xl text-ivory"
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.id}
                to={l.href}
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="display-serif text-left text-4xl text-ivory"
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      )}
    </nav>
  );
}
