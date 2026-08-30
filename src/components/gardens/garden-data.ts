export type PlotStatus = "available" | "full" | "partial" | "unpaid" | "buried";

export type Plot = {
  n: number;
  ref: string;
  status: PlotStatus;
  label: string;
};

export type Cell = { coord: string; plots: Plot[] };
export type Row = { letter: string; cells: Cell[] };

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
};

const SEED: Record<string, { s: PlotStatus; n?: string }> = {
  AA1: { s: "buried", n: "Ahmad Hassan" },
  AA2: { s: "full" },
  AB2: { s: "partial" },
  BA1: { s: "partial" },
  BA2: { s: "unpaid" },
  BA4: { s: "buried", n: "Fatima Ali" },
  CB1: { s: "buried", n: "Ibrahim Khan" },
  CB2: { s: "buried", n: "Zainab R." },
  CB3: { s: "full" },
  DA3: { s: "full" },
  DE2: { s: "full" },
  EC1: { s: "buried", n: "Yusuf M." },
  FA1: { s: "buried", n: "Omar S." },
  FD2: { s: "partial" },
  GB4: { s: "unpaid" },
  HE1: { s: "buried", n: "Sara K." },
};

export const LEGEND: { name: string; dot: string }[] = [
  { name: "Available", dot: STATUS_META.available.dot },
  { name: "Reserved (Full)", dot: STATUS_META.full.dot },
  { name: "Reserved (Partial)", dot: STATUS_META.partial.dot },
  { name: "Reserved (Unpaid)", dot: STATUS_META.unpaid.dot },
  { name: "Buried", dot: STATUS_META.buried.dot },
];

export const GARDEN_ROWS: Row[] = ROW_LETTERS.map((letter) => ({
  letter,
  cells: COLS.map((col) => {
    const coord = col + letter;
    const plots = [1, 2, 3, 4].map((n) => {
      const seeded = SEED[coord + n] ?? { s: "available" as PlotStatus };
      const meta = STATUS_META[seeded.s];
      const label = seeded.s === "buried" ? seeded.n ?? "Buried" : meta.label;
      return { n, ref: coord + n, status: seeded.s, label };
    });
    return { coord, plots };
  }),
}));
