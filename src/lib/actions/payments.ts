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

  const amount =
    Math.round(
      Number(String(formData.get("amount") ?? "").replace(/[$,]/g, "")) * 100
    ) / 100;
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter a payment amount greater than zero." };
  }
  if (amount > 99_999_999) {
    return { error: "Payment amount is too large." };
  }
  const paidAt = String(formData.get("paid_at") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAt)) {
    return { error: "Enter a valid payment date." };
  }
  const method = String(formData.get("method") ?? "Cash");
  if (!["Cash", "Check", "Card", "Other"].includes(method)) {
    return { error: "Invalid payment method." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    plot_id: plotId,
    amount,
    paid_at: paidAt,
    method,
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
