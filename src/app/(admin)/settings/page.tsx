import { OrganizationProfile } from "@/components/settings/organization-profile";
import { RolesPermissions } from "@/components/settings/roles-permissions";
import { TeamMembers } from "@/components/settings/team-members";
import { AuditLog } from "@/components/settings/audit-log";
import { requireRole } from "@/lib/data/auth";
import { getRecentActivity } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const profile = await requireRole("admin");

  const supabase = await createClient();
  const [{ data: members }, { data: mappings }, activity] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at"),
    supabase
      .from("plot_representatives")
      .select("profile_id, plots(garden_id, ref)"),
    getRecentActivity(10),
  ]);

  // profile_id -> "a-AA1, a-AA2" for prefilling the edit dialog
  const plotsByMember: Record<string, string> = {};
  for (const m of mappings ?? []) {
    const plot = m.plots as unknown as { garden_id: string; ref: string } | null;
    if (!plot) continue;
    const slug = `${plot.garden_id}-${plot.ref}`;
    plotsByMember[m.profile_id] = plotsByMember[m.profile_id]
      ? `${plotsByMember[m.profile_id]}, ${slug}`
      : slug;
  }

  return (
    <div className="max-w-[940px] px-5 sm:px-8 lg:px-[44px] pt-6 sm:pt-[38px] pb-[56px]">
      <div className="mb-[30px]">
        <h1 className="font-extrabold text-[28px] sm:text-[38px] tracking-[-0.02em] mb-[6px]">
          Settings
        </h1>
        <p className="text-[15.5px] text-muted-foreground">
          Manage the organization profile, team access, and security.
        </p>
      </div>

      <div className="flex flex-col gap-[22px]">
        <OrganizationProfile />
        <RolesPermissions />
        <TeamMembers
          members={(members ?? []) as Profile[]}
          currentUserId={profile.id}
          plotsByMember={plotsByMember}
        />
        <AuditLog entries={activity} />
      </div>
    </div>
  );
}
