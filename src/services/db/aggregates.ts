import { asc, count, eq } from "drizzle-orm";

import { db } from "@/services/db/index";
import { gardens, plots } from "@/services/db/schema";
import { GRID_SIZE } from "@/services/trpc/lib/helpers";
import type { PlotStatus } from "@/lib/types";

export type GardenCounts = {
  id: string;
  name: string;
  arabic: string;
  total: number;
  occupied: number;
  reserved: number;
  available: number;
  unavailable: number;
};

export type DashboardStats = {
  total: number;
  occupied: number;
  reserved: number;
  available: number;
};

const RESERVED: PlotStatus[] = ["full", "partial", "unpaid"];

// Sparse model: only non-available plots have rows. `available` is derived as
// the full grid minus every non-available plot in the garden.
export async function getGardenCounts(): Promise<GardenCounts[]> {
  const [gardenRows, statusRows] = await Promise.all([
    db
      .select({ id: gardens.id, name: gardens.name, arabic: gardens.arabic_name })
      .from(gardens)
      .orderBy(asc(gardens.sort_order)),
    db
      .select({
        garden_id: plots.garden_id,
        status: plots.status,
        n: count(),
      })
      .from(plots)
      .groupBy(plots.garden_id, plots.status),
  ]);

  return gardenRows.map((g) => {
    const rows = statusRows.filter((r) => r.garden_id === g.id);
    const sum = (match: (s: PlotStatus) => boolean) =>
      rows
        .filter((r) => match(r.status as PlotStatus))
        .reduce((acc, r) => acc + Number(r.n), 0);

    const occupied = sum((s) => s === "buried");
    const reserved = sum((s) => RESERVED.includes(s));
    const unavailable = sum((s) => s === "unavailable");
    const available = Math.max(0, GRID_SIZE - occupied - reserved - unavailable);
    return {
      id: g.id,
      name: g.name,
      arabic: g.arabic,
      total: GRID_SIZE,
      occupied,
      reserved,
      available,
      unavailable,
    };
  });
}

export function sumStats(gardens: GardenCounts[]): DashboardStats {
  return gardens.reduce(
    (acc, g) => ({
      total: acc.total + g.total,
      occupied: acc.occupied + g.occupied,
      reserved: acc.reserved + g.reserved,
      available: acc.available + g.available,
    }),
    { total: 0, occupied: 0, reserved: 0, available: 0 }
  );
}

// Total paid per plot id, rounded once at the boundary.
export async function paidByPlot(): Promise<Map<string, number>> {
  const { payments } = await import("@/services/db/schema");
  const rows = await db
    .select({ plot_id: payments.plot_id, amount: payments.amount })
    .from(payments);
  const paid = new Map<string, number>();
  for (const r of rows) {
    paid.set(r.plot_id, (paid.get(r.plot_id) ?? 0) + Number(r.amount));
  }
  for (const [k, v] of paid) paid.set(k, Math.round(v * 100) / 100);
  return paid;
}

export { RESERVED };
