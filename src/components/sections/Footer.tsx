import { TOWER } from "@/lib/tower-brand";

export function Footer() {
  return (
    <footer className="bg-midnight px-6 py-20 text-ivory md:px-24">
      {/* abstract monogram — architectural line symbol */}
      <div className="flex justify-center">
        <svg width="72" height="96" viewBox="0 0 72 96" aria-hidden="true">
          <line x1="36" y1="4" x2="36" y2="92" stroke="oklch(0.693 0.058 78)" strokeWidth="1" />
          <line x1="20" y1="92" x2="36" y2="20" stroke="oklch(0.929 0.012 85 / 0.5)" strokeWidth="1" />
          <line x1="52" y1="92" x2="36" y2="20" stroke="oklch(0.929 0.012 85 / 0.5)" strokeWidth="1" />
          <line x1="14" y1="92" x2="58" y2="92" stroke="oklch(0.929 0.012 85 / 0.6)" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 border-t border-ivory/10 pt-14 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="tech-label text-gold">{TOWER.name}</p>
          <p className="mt-4 leading-relaxed text-ivory/60">
            {TOWER.locationLine}
            <br />
            {TOWER.tagline}
          </p>
        </div>
        <div>
          <p className="tech-label text-ivory/50">Contact</p>
          <p className="mt-4 leading-relaxed text-ivory/60">
            {TOWER.salesEmail}
            <br />
            {TOWER.salesPhone}
          </p>
        </div>
        <div>
          <p className="tech-label text-ivory/50">Sales Office</p>
          <p className="mt-4 leading-relaxed text-ivory/60">
            {TOWER.salesOfficeStreet}
            <br />
            {TOWER.salesOfficeLine}
          </p>
        </div>
        <div>
          <p className="tech-label text-ivory/50">Legal</p>
          <p className="mt-4 leading-relaxed text-ivory/60">
            All visuals are indicative.
            <br />
            © {new Date().getFullYear()} {TOWER.developer}
          </p>
        </div>
      </div>
    </footer>
  );
}
