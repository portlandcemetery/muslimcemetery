"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/data/auth";

export type PaymentActionState = { error: string | null };

export async function addPayment(
  plotId: string,
  plotSlug: string,
  _prev: PaymentActionState,
  formData: FormData
): Promise<PaymentActionState> {
  const profile = await requireRole("admin", "operator");

  const amount = Number(String(formData.get("amount") ?? "").replace(/[$,]/g, ""));
  if (Number.isNaN(amount) || amount <= 0) {
    return { error: "Enter a payment amount greater than zero." };
  }
  const paidAt = String(formData.get("paid_at") ?? "");
  if (!paidAt) {
    return { error: "Enter the payment date." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    plot_id: plotId,
    amount,
    paid_at: paidAt,
    method: String(formData.get("method") ?? "cash"),
    received_by: String(formData.get("received_by") ?? "").trim() || null,
    reference_no: String(formData.get("reference_no") ?? "").trim() || null,
    note: String(formData.get("note") ?? "").trim() || null,
    source: "manual", // future online-payment integration inserts source: 'online'
    created_by: profile.id,
  });

  if (error) {
    return { error: `Could not record payment: ${error.message}` };
  }

  revalidatePath(`/plots/${plotSlug}`);
  return { error: null };
}

export async function deletePayment(
  paymentId: string,
  plotSlug: string
): Promise<PaymentActionState> {
  await requireRole("admin", "operator");

  const supabase = await createClient();
  const { error } = await supabase.from("payments").delete().eq("id", paymentId);
  if (error) {
    return { error: `Could not delete payment: ${error.message}` };
  }

  revalidatePath(`/plots/${plotSlug}`);
  return { error: null };
}
