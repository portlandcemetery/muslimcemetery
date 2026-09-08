"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/data/auth";
import type { PlotStatus } from "@/lib/types";

export type SavePlotState = { error: string | null; savedAt: number | null };

const STATUSES: PlotStatus[] = [
  "available",
  "full",
  "partial",
  "unpaid",
  "buried",
  "unavailable",
];

const text = (formData: FormData, key: string) => {
  const v = String(formData.get(key) ?? "").trim();
  return v === "" ? null : v;
};

export async function savePlot(
  plotId: string,
  gardenId: string,
  ref: string,
  _prev: SavePlotState,
  formData: FormData
): Promise<SavePlotState> {
  const profile = await requireRole("admin", "operator");

  const status = String(formData.get("status") ?? "") as PlotStatus;
  if (!STATUSES.includes(status)) {
    return { error: "Invalid plot status.", savedAt: null };
  }

  const priceRaw = String(formData.get("price") ?? "").replace(/[$,]/g, "");
  const price = priceRaw === "" ? 0 : Math.round(Number(priceRaw) * 100) / 100;
  if (!Number.isFinite(price) || price < 0 || price > 99_999_999) {
    return { error: "Total plot value must be a valid amount.", savedAt: null };
  }

  const supabase = await createClient();

  // Only block the unavailable status when it's actually being changed —
  // operators must still be able to edit notes on an already-unavailable plot.
  // (The DB trigger is the hard guard either way.)
  if (status === "unavailable" && profile.role !== "admin") {
    const { data: current } = await supabase
      .from("plots")
      .select("status")
      .eq("id", plotId)
      .maybeSingle();
    if (current?.status !== "unavailable") {
      return {
        error: "Only administrators can mark plots unavailable.",
        savedAt: null,
      };
    }
  }
  const { error } = await supabase
    .from("plots")
    .update({
      status,
      price,
      deceased_name: text(formData, "deceased_name"),
      date_of_birth: text(formData, "date_of_birth"),
      date_of_death: text(formData, "date_of_death"),
      burial_date: text(formData, "burial_date"),
      id_tag_number: text(formData, "id_tag_number"),
      case_number: text(formData, "case_number"),
      county_of_death: text(formData, "county_of_death"),
      reservation_holder: text(formData, "reservation_holder"),
      purchaser_name: text(formData, "purchaser_name"),
      purchaser_phone: text(formData, "purchaser_phone"),
      purchaser_email: text(formData, "purchaser_email"),
      purchaser_address: text(formData, "purchaser_address"),
      notes: text(formData, "notes"),
      general_note: text(formData, "general_note"),
    })
    .eq("id", plotId);

  if (error) {
    return { error: `Save failed: ${error.message}`, savedAt: null };
  }

  revalidatePath(`/plots/${gardenId}-${ref}`);
  revalidatePath("/gardens");
  revalidatePath("/dashboard");
  return { error: null, savedAt: Date.now() };
}
