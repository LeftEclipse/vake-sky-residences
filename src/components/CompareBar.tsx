import { Link } from "@tanstack/react-router";
import { useCompare } from "@/lib/compare";
import { parseResidenceId } from "@/lib/tower-data";

export function CompareBar() {
  const { ids, clear } = useCompare();
  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-2xl -translate-x-1/2 items-center justify-between gap-4 border-t border-gold/40 bg-midnight/95 px-6 py-4 text-ivory backdrop-blur-sm md:bottom-6 md:border">
      <span className="tech-label text-gold">Compare</span>
      <div className="flex flex-1 flex-wrap items-center gap-4">
        {ids.map((id) => {
          const r = parseResidenceId(id);
          if (!r) return null;
          return (
            <Link
              key={id}
              to="/residence/$id"
              params={{ id }}
              className="link-line text-sm"
              data-cursor="VIEW"
            >
              {r.floor}.{String(r.unit).padStart(2, "0")} · {r.interior} m²
            </Link>
          );
        })}
      </div>
      <button onClick={clear} className="tech-label text-ivory/50 hover:text-ivory">
        Clear
      </button>
    </div>
  );
}
