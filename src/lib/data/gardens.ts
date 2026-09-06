import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Garden, MapPlot } from "@/lib/types";
import { buildRowsFromPlots, type GardenInfo, type Row } from "@/components/gardens/garden-data";

export async function getGardens(): Promise<GardenInfo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gardens")
    .select("id, name, arabic_name, sort_order")
    .order("sort_order");
  if (error) throw new Error(`Failed to load gardens: ${error.message}`);
  return (data as Garden[]).map((g) => ({
    id: g.id,
    name: g.name,
    arabic: g.arabic_name,
  }));
}

export async function getMapRows(
  gardenId: string,
  minePlotIds?: Set<string>
): Promise<Row[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_map_plots", {
    p_garden_id: gardenId,
  });
  if (error) throw new Error(`Failed to load plots: ${error.message}`);
  return buildRowsFromPlots((data ?? []) as MapPlot[], minePlotIds);
}

// Plot ids mapped to the signed-in user (RLS limits rows to their own mappings)
export async function getMyPlotIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase.from("plot_representatives").select("plot_id");
  return new Set((data ?? []).map((r) => r.plot_id as string));
}
