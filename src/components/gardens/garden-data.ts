import type { MapPlot, PlotStatus } from "@/lib/types";

export type { PlotStatus };

export type Plot = {
  n: number;
  ref: string;
  status: PlotStatus;
  label: string;
  named?: boolean;
  mine?: boolean;
};

export type Cell = { coord: string; plots: Plot[] };
export type Row = { letter: string; cells: Cell[] };

export type GardenInfo = { id: string; name: string; arabic: string };

export const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const ROW_LETTERS = ["A", "B", "C", "D", "E", "F"];

export const STATUS_META: Record<
  PlotStatus,
  { dot: string; label: string; labelClass: string }
> = {
  available: { dot: "bg-green-700", label: "AV", labelClass: "text-muted-foreground/60" },
  full: { dot: "bg-cyan-700", label: "RES", labelClass: "text-muted-foreground" },
  partial: { dot: "bg-yellow-600", label: "RES", labelClass: "text-muted-foreground" },
  unpaid: { dot: "bg-orange-800", label: "RES", labelClass: "text-muted-foreground" },
  buried: { dot: "bg-chart-3", label: "", labelClass: "text-card-foreground" },
  unavailable: { dot: "bg-zinc-500", label: "N/A", labelClass: "text-muted-foreground/50" },
};

export const LEGEND: { name: string; dot: string }[] = [
  { name: "Available", dot: STATUS_META.available.dot },
  { name: "Reserved (Full)", dot: STATUS_META.full.dot },
  { name: "Reserved (Partial)", dot: STATUS_META.partial.dot },
  { name: "Reserved (Unpaid)", dot: STATUS_META.unpaid.dot },
  { name: "Buried", dot: STATUS_META.buried.dot },
  { name: "Unavailable", dot: STATUS_META.unavailable.dot },
];

export function buildRowsFromPlots(
  plots: MapPlot[],
  minePlotIds?: Set<string>
): Row[] {
  const byRef = new Map(plots.map((p) => [p.ref, p]));
  return ROW_LETTERS.map((letter) => ({
    letter,
    cells: COLS.map((col) => {
      const coord = col + letter;
      const cellPlots = [1, 2, 3, 4].map((n) => {
        const ref = coord + n;
        const plot = byRef.get(ref);
        const status: PlotStatus = plot?.status ?? "available";
        const meta = STATUS_META[status];
        const label =
          plot?.deceased_name ?? (status === "buried" ? "Buried" : meta.label);
        const named = Boolean(plot?.deceased_name);
        const mine = plot ? minePlotIds?.has(plot.id) ?? false : false;
        return { n, ref, status, label, named, mine };
      });
      return { coord, plots: cellPlots };
    }),
  }));
}
