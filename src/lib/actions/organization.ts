"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/data/auth";

export type OrgSettingsState = { error: string | null; savedAt: number | null };

export async function saveOrganizationSettings(
  _prev: OrgSettingsState,
  formData: FormData
): Promise<OrgSettingsState> {
  await requireRole("admin");

  const orgName = String(formData.get("org_name") ?? "").trim();
  const cemeteryName = String(formData.get("cemetery_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!orgName) {
    return { error: "Organization name is required.", savedAt: null };
  }
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Contact email is not a valid address.", savedAt: null };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("organization_settings")
    .update({
      org_name: orgName,
      cemetery_name: cemeteryName,
      contact_email: contactEmail,
      phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    return { error: error.message, savedAt: null };
  }

  revalidatePath("/settings");
  return { error: null, savedAt: Date.now() };
}
