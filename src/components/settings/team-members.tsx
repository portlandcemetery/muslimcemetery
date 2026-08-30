import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SettingsSection } from "./settings-section";

type Member = {
  name: string;
  email: string;
  role: string;
  initials: string;
  color: string;
  lastLogin: string;
};

const TEAM: Member[] = [
  { name: "Yusuf Abdullah", email: "yusuf@icportland.org", role: "Administrator", initials: "YA", color: "bg-primary", lastLogin: "10 min ago" },
  { name: "Aisha Rahman", email: "aisha@icportland.org", role: "Operator", initials: "AR", color: "bg-accent", lastLogin: "2 hours ago" },
  { name: "Musa Idris", email: "musa@icportland.org", role: "Operator", initials: "MI", color: "bg-chart-3", lastLogin: "Yesterday" },
  { name: "Sara Karim", email: "sara@icportland.org", role: "Viewer / Auditor", initials: "SK", color: "bg-chart-4", lastLogin: "3 days ago" },
];

export function TeamMembers() {
  return (
    <SettingsSection
      title="Team Members"
      description="Access and most recent sign-in, for auditability."
      action={
        <Button className="h-auto py-[11px] px-[18px] text-sm font-semibold rounded-[11px]">
          + Invite Member
        </Button>
      }
    >
      {TEAM.map((m) => (
        <div
          key={m.email}
          className="flex items-center gap-[14px] py-[14px] border-t border-border"
        >
          <Avatar className="size-[42px]">
            <AvatarFallback
              className={`${m.color} text-white font-bold text-[15px]`}
            >
              {m.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-foreground">{m.name}</div>
            <div className="text-[13px] text-muted-foreground/90">{m.email}</div>
          </div>
          <span className="py-[5px] px-3 rounded-full bg-primary/10 text-primary text-[12.5px] font-bold flex-none">
            {m.role}
          </span>
          <span className="text-[13px] text-muted-foreground/90 flex-none w-[150px] text-right">
            Last login {m.lastLogin}
          </span>
        </div>
      ))}
    </SettingsSection>
  );
}
