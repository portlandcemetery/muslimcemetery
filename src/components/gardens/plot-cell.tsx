import Link from "next/link";
import { STATUS_META, type Cell } from "./garden-data";

export function PlotCell({ cell }: { cell: Cell }) {
  return (
    <div className="w-[158px] flex-none bg-card border border-input rounded-[13px] p-[10px]">
      <div className="text-xs font-extrabold tracking-[0.03em] text-primary text-center mb-2">
        {cell.coord}
      </div>
      <div className="grid grid-cols-2 gap-[7px]">
        {cell.plots.map((p) => {
          const meta = STATUS_META[p.status];
          return (
            <Link
              key={p.ref}
              href={`/plots/${p.ref}`}
              title={`Plot ${p.ref}`}
              className="block min-w-0 min-h-[56px] rounded-[9px] border border-border bg-white/50 py-[7px] px-2 hover:border-primary hover:shadow-[0_5px_14px_-7px] hover:shadow-primary/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-muted-foreground/70">
                  {p.n}
                </span>
                <span className={`w-[9px] h-[9px] rounded-full ${meta.dot}`} />
              </div>
              <div
                className={`mt-2 text-[11px] font-semibold truncate ${meta.labelClass}`}
              >
                {p.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
