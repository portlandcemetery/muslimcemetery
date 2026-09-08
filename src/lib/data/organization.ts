import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrganizationSettings } from "@/lib/types";

const EMPTY: OrganizationSettings = {
  org_name: "",
  cemetery_name: "",
  contact_email: "",
  phone: "",
};

export async function getOrganizationSettings(): Promise<OrganizationSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_settings")
    .select("org_name, cemetery_name, contact_email, phone")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as OrganizationSettings) ?? EMPTY;
}
