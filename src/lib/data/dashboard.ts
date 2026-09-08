import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ActivityEntry, PlotStatus } from "@/lib/types";

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

export async function getGardenCounts(): Promise<GardenCounts[]> {
  const supabase = await createClient();
  // Staff-only callers (dashboard, reports) — direct plots read under staff RLS
  const [{ data: gardens, error: gErr }, { data: plots, error: pErr }] =
    await Promise.all([
      supabase.from("gardens").select("id, name, arabic_name").order("sort_order"),
      supabase.from("plots").select("garden_id, status").limit(10000),
    ]);
  if (gErr) throw new Error(gErr.message);
  if (pErr) throw new Error(pErr.message);

  return (gardens ?? []).map((g) => {
    const rows = (plots ?? []).filter((p) => p.garden_id === g.id);
    const count = (match: (s: PlotStatus) => boolean) =>
      rows.filter((r) => match(r.status as PlotStatus)).length;
    return {
      id: g.id,
      name: g.name,
      arabic: g.arabic_name,
      total: count(() => true),
      occupied: count((s) => s === "buried"),
      reserved: count((s) => RESERVED.includes(s)),
      available: count((s) => s === "available"),
      unavailable: count((s) => s === "unavailable"),
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

export async function getRecentActivity(limit = 8): Promise<ActivityEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activity_log")
    .select("id, actor_name, action, entity, plot_ref, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityEntry[];
}
