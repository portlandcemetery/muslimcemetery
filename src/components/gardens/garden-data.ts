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

type Seed = Record<string, { s: PlotStatus; n?: string }>;

const SEED_A: Seed = {
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

const SEED_B: Seed = {
  AA1: { s: "buried", n: "Khalid Mahmoud" },
  AA3: { s: "buried", n: "Amina Yusuf" },
  AB1: { s: "full" },
  BA2: { s: "buried", n: "Bilal Osman" },
  BC3: { s: "partial" },
  CA1: { s: "full" },
  CA2: { s: "full" },
  CD4: { s: "unpaid" },
  DB1: { s: "buried", n: "Hafsa N." },
  DD2: { s: "partial" },
  EB3: { s: "buried", n: "Idris Ali" },
  EE1: { s: "full" },
  FC2: { s: "unpaid" },
  GA4: { s: "buried", n: "Maryam S." },
  GD1: { s: "partial" },
  HB2: { s: "full" },
};

const SEED_C: Seed = {
  AB4: { s: "buried", n: "Salim Farah" },
  AC1: { s: "partial" },
  BB1: { s: "buried", n: "Nadia Aziz" },
  BD3: { s: "full" },
  CC2: { s: "unpaid" },
  CE1: { s: "buried", n: "Hamza K." },
  DA2: { s: "full" },
  DC4: { s: "partial" },
  EA1: { s: "buried", n: "Layla Omar" },
  ED3: { s: "full" },
  FB2: { s: "buried", n: "Tariq J." },
  FE4: { s: "unpaid" },
  GC1: { s: "partial" },
  HA3: { s: "full" },
  HD2: { s: "buried", n: "Rashid M." },
};

export type Garden = { id: string; name: string; arabic: string; seed: Seed };

export const GARDENS: Garden[] = [
  { id: "a", name: "Garden A – Al-Firdaus", arabic: "الفردوس", seed: SEED_A },
  { id: "b", name: "Garden B – Al-Kawthar", arabic: "الكوثر", seed: SEED_B },
  { id: "c", name: "Garden C – Ar-Rawdah", arabic: "الروضة", seed: SEED_C },
];

export const LEGEND: { name: string; dot: string }[] = [
  { name: "Available", dot: STATUS_META.available.dot },
  { name: "Reserved (Full)", dot: STATUS_META.full.dot },
  { name: "Reserved (Partial)", dot: STATUS_META.partial.dot },
  { name: "Reserved (Unpaid)", dot: STATUS_META.unpaid.dot },
  { name: "Buried", dot: STATUS_META.buried.dot },
];

export function buildRows(seed: Seed): Row[] {
  return ROW_LETTERS.map((letter) => ({
    letter,
    cells: COLS.map((col) => {
      const coord = col + letter;
      const plots = [1, 2, 3, 4].map((n) => {
        const seeded = seed[coord + n] ?? { s: "available" as PlotStatus };
        const meta = STATUS_META[seeded.s];
        const label = seeded.s === "buried" ? seeded.n ?? "Buried" : meta.label;
        return { n, ref: coord + n, status: seeded.s, label };
      });
      return { coord, plots };
    }),
  }));
}
