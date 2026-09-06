import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isTransientAuthError } from "@/lib/supabase/auth-errors";
import type { Profile, UserRole } from "@/lib/types";

// Secure auth check (the proxy check is optimistic only).
export const getSessionProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) {
    // A hiccup (network, rate limit, 5xx) must not masquerade as a sign-out —
    // fail the request instead of silently redirecting to the sign-in page.
    if (error && isTransientAuthError(error)) {
      throw new Error(`Auth check failed, try again: ${error.message}`);
    }
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();
  // A failed profile read is a DB error, not a missing account
  if (profileError) throw new Error(profileError.message);

  return (profile as Profile) ?? null;
});

export async function requireProfile(): Promise<Profile> {
  const profile = await getSessionProfile();
  if (!profile) redirect("/");
  return profile;
}

export async function requireRole(...roles: UserRole[]): Promise<Profile> {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) redirect("/gardens");
  return profile;
}
