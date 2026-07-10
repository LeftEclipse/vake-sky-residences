import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { gsap, prefersReducedMotion, scrollToId } from "@/lib/gsapSetup";

const LINKS = [
  { id: "landmark", label: "The Tower" },
  { id: "explorer", label: "Residences" },
  { id: "life", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Enquire" },
];

export function Navigation() {
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

  const go = (id: string) => {
    setOpen(false);
    if (onHome) scrollToId(id);
  };

  return (
    <nav
      ref={ref}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 py-6 text-ivory mix-blend-difference md:px-12"
      aria-label="Main navigation"
    >
      <div data-nav-item className="pointer-events-auto overflow-hidden">
        <Link to="/" className="tech-label text-ivory" data-cursor="">
          VR — VAKE SKY TOWER
        </Link>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <div key={l.id} data-nav-item className="pointer-events-auto overflow-hidden">
            {onHome ? (
              <button onClick={() => go(l.id)} className="tech-label link-line text-ivory">
                {l.label}
              </button>
            ) : (
              <Link to="/" className="tech-label link-line text-ivory">
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
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="display-serif text-left text-4xl text-ivory"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
