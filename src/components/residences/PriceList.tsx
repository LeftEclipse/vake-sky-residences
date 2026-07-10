import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { RevealMask } from "@/components/motion/RevealMask";
import { gsap, prefersReducedMotion } from "@/lib/gsapSetup";
import {
  ALL_FLOORS,
  BEDROOM_OPTIONS,
  EMPTY_FILTERS,
  STATUS_OPTIONS,
  filterResidences,
  formatPrice,
  getAllResidences,
  getResidencePrice,
  layoutLabel,
  segmentOptions,
  type PriceListFilters,
} from "@/lib/residence-pricing";
import { segmentForFloor, type Residence, type UnitStatus } from "@/lib/tower-data";

const STATUS_STYLES: Record<UnitStatus, string> = {
  available: "text-emerald-700",
  reserved: "text-amber-700",
  sold: "text-charcoal/40",
};

const STATUS_DOT: Record<UnitStatus, string> = {
  available: "bg-emerald-500",
  reserved: "bg-amber-500",
  sold: "bg-charcoal/25",
};

const PAGE_SIZE = 20;

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="tech-label text-charcoal/50">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tech-label border px-3 py-2 transition-colors duration-300 ${
        active
          ? "border-gold bg-gold text-midnight"
          : "border-charcoal/20 text-charcoal/70 hover:border-gold/60 hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function PriceList({ highlightId }: { highlightId?: string | null }) {
  const allResidences = useMemo(() => getAllResidences(), []);
  const [filters, setFilters] = useState<PriceListFilters>(EMPTY_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLTableSectionElement>(null);

  const filtered = useMemo(
    () => filterResidences(allResidences, filters),
    [allResidences, filters],
  );
  const visible = filtered.slice(0, visibleCount);
  const hasActiveFilters =
    filters.segments.length > 0 ||
    filters.floors.length > 0 ||
    filters.bedrooms.length > 0 ||
    filters.statuses.length > 0;

  const updateFilters = (patch: Partial<PriceListFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setVisibleCount(PAGE_SIZE);
  };

  useEffect(() => {
    if (!tableRef.current || prefersReducedMotion()) return;
    const rows = tableRef.current.querySelectorAll("[data-price-row]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: { trigger: tableRef.current, start: "top 88%" },
        },
      );
    }, tableRef);
    return () => ctx.revert();
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="prices"
      className="bg-ivory py-24 text-charcoal md:py-32"
      aria-labelledby="prices-heading"
    >
      <div className="px-6 md:px-24">
        <p className="tech-label text-charcoal/50">Residence Price List</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 id="prices-heading" className="display-serif text-4xl md:text-6xl">
            <AnimatedText text="Find your residence." as="span" mode="words" stagger={0.07} />
          </h2>
          <p className="tech-label text-charcoal/50">
            {filtered.length} of {allResidences.length} residences
          </p>
        </div>

        <RevealMask className="mt-12" direction="up">
          <div className="grid gap-8 border border-charcoal/10 bg-stone/20 p-6 md:grid-cols-2 md:p-10 lg:grid-cols-4">
          <FilterGroup label="Collection">
            {segmentOptions().map((seg) => (
              <FilterChip
                key={seg.id}
                active={filters.segments.includes(seg.id)}
                onClick={() =>
                  updateFilters({ segments: toggle(filters.segments, seg.id) })
                }
              >
                {seg.name}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Floor">
            {ALL_FLOORS.filter((_, i) => i % 8 === 0).map((floor) => (
              <FilterChip
                key={floor}
                active={filters.floors.includes(floor)}
                onClick={() => updateFilters({ floors: toggle(filters.floors, floor) })}
              >
                {String(floor).padStart(2, "0")}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Layout">
            {BEDROOM_OPTIONS.map((bedrooms) => (
              <FilterChip
                key={bedrooms}
                active={filters.bedrooms.includes(bedrooms)}
                onClick={() =>
                  updateFilters({ bedrooms: toggle(filters.bedrooms, bedrooms) })
                }
              >
                {layoutLabel(bedrooms)}
              </FilterChip>
            ))}
          </FilterGroup>

          <FilterGroup label="Status">
            {STATUS_OPTIONS.map((status) => (
              <FilterChip
                key={status}
                active={filters.statuses.includes(status)}
                onClick={() =>
                  updateFilters({ statuses: toggle(filters.statuses, status) })
                }
              >
                {status}
              </FilterChip>
            ))}
          </FilterGroup>
          </div>
        </RevealMask>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setFilters(EMPTY_FILTERS);
              setVisibleCount(PAGE_SIZE);
            }}
            className="tech-label link-line mt-6 text-gold"
          >
            Reset filters
          </button>
        )}

        <div className="mt-10 overflow-x-auto border border-charcoal/10">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-charcoal/15 bg-stone/30">
                {[
                  "Residence",
                  "Collection",
                  "Floor",
                  "Layout",
                  "Interior",
                  "Terrace",
                  "Orientation",
                  "Price",
                  "Status",
                  "",
                ].map((col) => (
                  <th key={col} className="tech-label px-4 py-4 text-charcoal/50">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tableRef}>
              {visible.map((residence) => (
                <PriceRow
                  key={residence.id}
                  residence={residence}
                  highlighted={highlightId === residence.id}
                />
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-charcoal/50">
                    No residences match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {visibleCount < filtered.length && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className="btn-fill tech-label border border-charcoal px-10 py-4 text-charcoal transition-colors duration-500 hover:text-ivory"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PriceRow({
  residence,
  highlighted,
}: {
  residence: Residence;
  highlighted: boolean;
}) {
  const segment = segmentForFloor(residence.floor);
  const num = `${residence.floor}.${String(residence.unit).padStart(2, "0")}`;
  const price = getResidencePrice(residence);

  return (
    <tr
      data-price-row
      className={`border-b border-charcoal/10 transition-colors duration-300 ${
        highlighted ? "bg-gold/10" : "hover:bg-stone/40"
      }`}
    >
      <td className="display-serif px-4 py-4 text-lg">{num}</td>
      <td className="px-4 py-3 text-charcoal/70">{segment?.name ?? "—"}</td>
      <td className="px-4 py-3">{String(residence.floor).padStart(2, "0")}</td>
      <td className="px-4 py-3">{layoutLabel(residence.bedrooms)}</td>
      <td className="px-4 py-3">{residence.interior} m²</td>
      <td className="px-4 py-3">{residence.terrace} m²</td>
      <td className="px-4 py-3 text-charcoal/60">{residence.orientation}</td>
      <td className="display-serif px-4 py-3 text-lg">
        {residence.status === "sold" ? "—" : formatPrice(price)}
      </td>
      <td className="px-4 py-3">
        <span className={`tech-label inline-flex items-center gap-2 capitalize ${STATUS_STYLES[residence.status]}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[residence.status]}`} />
          {residence.status}
        </span>
      </td>
      <td className="px-4 py-3">
        {residence.status === "available" ? (
          <Link
            to="/residence/$id"
            params={{ id: residence.id }}
            className="tech-label link-line text-gold"
            data-cursor="VIEW"
          >
            Detail →
          </Link>
        ) : (
          <span className="tech-label text-charcoal/30">—</span>
        )}
      </td>
    </tr>
  );
}
