"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/data/auth";
import type { UserRole } from "@/lib/types";

export type UserActionState = { error: string | null; success?: boolean };

type AdminClient = ReturnType<typeof createAdminClient>;

// Resolves "a-AA1, b-CB2" style refs to plot ids; returns an error string on bad input
async function resolvePlotRefs(
  admin: AdminClient,
  raw: string
): Promise<{ plotIds: string[] } | { error: string }> {
  const plotRefs = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const plotIds: string[] = [];
  for (const slug of plotRefs) {
    const match = /^([a-z])-([A-Ha-h][A-Fa-f][1-4])$/.exec(slug);
    if (!match) {
      return { error: `"${slug}" is not a valid plot (use garden-ref, e.g. a-AA1).` };
    }
    const { data: plot } = await admin
      .from("plots")
      .select("id")
      .eq("garden_id", match[1])
      .eq("ref", match[2].toUpperCase())
      .maybeSingle();
    if (!plot) {
      return { error: `Plot "${slug}" was not found.` };
    }
    plotIds.push(plot.id);
  }
  // Dedupe — "a-AA1, a-AA1" would otherwise violate the mapping PK on insert
  return { plotIds: [...new Set(plotIds)] };
}

export async function createUser(
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  await requireRole("admin");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "viewer") as UserRole;
  if (!["admin", "operator", "viewer"].includes(role)) {
    return { error: "Invalid role." };
  }

  if (!email || !password || !fullName) {
    return { error: "Name, email and password are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const admin = createAdminClient();

  const resolved = await resolvePlotRefs(admin, String(formData.get("plot_refs") ?? ""));
  if ("error" in resolved) return { error: resolved.error };
  const { plotIds } = resolved;

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) {
    return { error: error.message };
  }

  if (plotIds.length > 0 && role === "viewer") {
    const { error: mapError } = await admin
      .from("plot_representatives")
      .insert(plotIds.map((plot_id) => ({ profile_id: data.user.id, plot_id })));
    if (mapError) {
      return { error: `User created but plot mapping failed: ${mapError.message}` };
    }
  }

  revalidatePath("/settings");
  return { error: null, success: true };
}

export async function updateUser(
  userId: string,
  _prev: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const me = await requireRole("admin");

  const role = String(formData.get("role") ?? "") as UserRole;
  if (!["admin", "operator", "viewer"].includes(role)) {
    return { error: "Invalid role." };
  }
  if (me.id === userId && role !== "admin") {
    return { error: "You cannot demote your own account." };
  }

  const admin = createAdminClient();

  const resolved = await resolvePlotRefs(admin, String(formData.get("plot_refs") ?? ""));
  if ("error" in resolved) return { error: resolved.error };
  const plotIds = role === "viewer" ? resolved.plotIds : [];

  const { error: roleError } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (roleError) {
    return { error: roleError.message };
  }

  // Replace plot mappings wholesale with what the form submitted
  const { error: clearError } = await admin
    .from("plot_representatives")
    .delete()
    .eq("profile_id", userId);
  if (clearError) {
    return { error: clearError.message };
  }
  if (plotIds.length > 0) {
    const { error: mapError } = await admin
      .from("plot_representatives")
      .insert(plotIds.map((plot_id) => ({ profile_id: userId, plot_id })));
    if (mapError) {
      return { error: `Role updated but plot mapping failed: ${mapError.message}` };
    }
  }

  revalidatePath("/settings");
  return { error: null, success: true };
}

export async function deleteUser(userId: string): Promise<UserActionState> {
  const me = await requireRole("admin");
  if (me.id === userId) {
    return { error: "You cannot remove your own account." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { error: null, success: true };
}
