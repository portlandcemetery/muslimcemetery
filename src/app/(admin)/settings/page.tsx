import { OrganizationProfile } from "@/components/settings/organization-profile";
import { RolesPermissions } from "@/components/settings/roles-permissions";
import { TeamMembers } from "@/components/settings/team-members";
import { SecuritySettings } from "@/components/settings/security-settings";
import { AuditLog } from "@/components/settings/audit-log";

export default function SettingsPage() {
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
        <TeamMembers />
        <SecuritySettings />
        <AuditLog />
      </div>
    </div>
  );
}
