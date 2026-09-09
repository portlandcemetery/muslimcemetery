"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OrganizationProfileForm } from "@/components/settings/organization-profile-form";
import { RolesPermissions } from "@/components/settings/roles-permissions";
import { TeamMembers } from "@/components/settings/team-members";
import { AuditLog } from "@/components/settings/audit-log";
import { PageLoader } from "@/components/page-loader";
import { useTRPC } from "@/services/trpc/client";

export default function SettingsPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const me = useQuery(trpc.auth.me.queryOptions());
  const allowed = me.data?.role === "admin";

  useEffect(() => {
    if (me.data && me.data.role !== "admin") router.replace("/gardens");
  }, [me.data, router]);

  const users = useQuery(trpc.users.list.queryOptions(undefined, { enabled: allowed }));
  const org = useQuery(
    trpc.organization.get.queryOptions(undefined, { enabled: allowed })
  );
  const activity = useQuery(
    trpc.dashboard.recentActivity.queryOptions({ limit: 10 }, { enabled: allowed })
  );

  if (!allowed || !users.data || !org.data) {
    return <PageLoader />;
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
        <OrganizationProfileForm settings={org.data} />
        <RolesPermissions />
        <TeamMembers
          members={users.data.members}
          currentUserId={users.data.currentUserId}
          plotsByMember={users.data.plotsByMember}
        />
        <AuditLog entries={activity.data ?? []} />
      </div>
    </div>
  );
}
