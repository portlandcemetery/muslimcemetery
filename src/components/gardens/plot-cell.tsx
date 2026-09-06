import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { STATUS_META as DETAIL_META } from "@/components/plots/plot-status-data";
import { STATUS_META, type Cell, type Plot } from "./garden-data";

function tipText(p: Plot): string {
  const parts = [`Plot ${p.ref} · ${DETAIL_META[p.status].badge}`];
  if (p.named && p.label) parts.push(p.label);
  if (p.mine) parts.push("Your plot");
  return parts.join(" — ");
}

export function PlotCell({
  cell,
  gardenId,
  isAdmin,
  dimOthers = false,
}: {
  cell: Cell;
  gardenId: string;
  isAdmin: boolean;
  dimOthers?: boolean;
}) {
  const hasMine = cell.plots.some((p) => p.mine);
  return (
    <div
      className={`w-[240px] flex-none bg-card border border-input rounded-[13px] p-[10px] transition-opacity duration-150 ${
        dimOthers && !hasMine ? "opacity-20" : ""
      }`}
    >
      <div className="text-xs font-extrabold tracking-[0.03em] text-primary text-center mb-2">
        {cell.coord}
      </div>
      <div className="grid grid-cols-2 gap-[7px]">
        {cell.plots.map((p) => {
          const meta = STATUS_META[p.status];
          const unavailable = p.status === "unavailable";
          const dimmed = dimOthers && hasMine && !p.mine;
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-muted-foreground/70">
                  {p.n}
                </span>
                <span className={`w-[9px] h-[9px] rounded-full ${meta.dot}`} />
              </div>
              <div
                className={`mt-2 text-[12px] font-semibold truncate ${
                  p.named ? "text-card-foreground" : meta.labelClass
                }`}
              >
                {p.label}
              </div>
            </>
          );

          // Unavailable plots (trees/obstacles) are dark grey and inert;
          // only admin keeps the link so the status can be reverted.
          const trigger =
            unavailable && !isAdmin ? (
              <div
                className={`block min-w-0 min-h-[64px] rounded-[9px] border border-zinc-300 bg-zinc-300/60 py-[7px] px-2 cursor-not-allowed transition-opacity duration-150 ${
                  dimmed ? "opacity-20" : "opacity-70"
                }`}
              >
                {inner}
              </div>
            ) : (
              <Link
                href={`/plots/${gardenId}-${p.ref}`}
                className={`block min-w-0 min-h-[64px] rounded-[9px] border py-[7px] px-2 transition-opacity duration-150 hover:border-primary hover:shadow-[0_5px_14px_-7px] hover:shadow-primary/50 ${
                  dimmed ? "opacity-20" : ""
                } ${
                  unavailable
                    ? `border-zinc-300 bg-zinc-300/60 ${dimmed ? "" : "opacity-80"}`
                    : p.mine
                      ? "border-primary/60 bg-primary/10 ring-1 ring-primary/30"
                      : "border-border bg-white/50"
                }`}
              >
                {inner}
              </Link>
            );

          return (
            <Tooltip key={p.ref}>
              <TooltipTrigger render={trigger} />
              <TooltipContent>{tipText(p)}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
