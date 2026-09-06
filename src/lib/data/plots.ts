import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Payment, PlotDocument, PlotRow } from "@/lib/types";

export async function getPlot(
  gardenId: string,
  ref: string
): Promise<PlotRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plots")
    .select("*")
    .eq("garden_id", gardenId)
    .eq("ref", ref)
    .maybeSingle();
  return data as PlotRow | null;
}

export async function getDocuments(plotId: string): Promise<PlotDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("plot_id", plotId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to load documents: ${error.message}`);
  return (data ?? []) as PlotDocument[];
}

export async function getPayments(plotId: string): Promise<Payment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("plot_id", plotId)
    .order("paid_at", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Failed to load payments: ${error.message}`);
  return (data ?? []) as Payment[];
}
