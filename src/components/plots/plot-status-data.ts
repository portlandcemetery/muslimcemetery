export type PlotDetailStatus = "available" | "full" | "partial" | "none" | "buried";

export const STATUS_META: Record<
  PlotDetailStatus,
  { badge: string; option: string; badgeClass: string }
> = {
  available: {
    badge: "Available",
    option: "Available",
    badgeClass: "text-green-700 border-green-700 bg-green-700/10",
  },
  full: {
    badge: "Reserved (Full Payment)",
    option: "Reserved with full payment",
    badgeClass: "text-cyan-700 border-cyan-700 bg-cyan-700/10",
  },
  partial: {
    badge: "Reserved (Partial Payment)",
    option: "Reserved with partial payment",
    badgeClass: "text-accent border-accent bg-accent/10",
  },
  none: {
    badge: "Reserved (Unpaid)",
    option: "Reserved without payment",
    badgeClass: "text-orange-800 border-orange-800 bg-orange-800/10",
  },
  buried: {
    badge: "Buried / Occupied",
    option: "Buried / Occupied",
    badgeClass: "text-chart-3 border-chart-3 bg-chart-3/10",
  },
};

export const STATUS_ORDER: PlotDetailStatus[] = [
  "available",
  "full",
  "partial",
  "none",
  "buried",
];
