import { SettingsSection } from "./settings-section";

type Entry = { who: string; what: string; time: string; dot: string };

const AUDIT: Entry[] = [
  { who: "Aisha Rahman", what: "recorded a burial on Plot AA-104", time: "2h ago", dot: "bg-chart-3" },
  { who: "Musa Idris", what: "transferred the deed for Plot RD-12", time: "1d ago", dot: "bg-chart-1" },
  { who: "Yusuf Abdullah", what: "updated role permissions for Operator", time: "1d ago", dot: "bg-chart-2" },
  { who: "Aisha Rahman", what: "confirmed reservation on Plot KC-42", time: "2d ago", dot: "bg-chart-4" },
  { who: "System", what: "generated the automatic weekly backup", time: "3d ago", dot: "bg-chart-5" },
];

export function AuditLog() {
  return (
    <SettingsSection
      title="Audit Log"
      description="Every change and sign-in, recorded automatically."
      action={
        <a
          href="#"
          className="text-[13.5px] font-semibold text-primary hover:text-primary/80"
        >
          View full log →
        </a>
      }
    >
      {AUDIT.map((a, i) => (
        <div key={i} className="flex gap-[14px] py-[13px] border-t border-border">
          <span className={`flex-none mt-[5px] w-[9px] h-[9px] rounded-full ${a.dot}`} />
          <div className="flex-1">
            <div className="text-[14.5px] text-card-foreground">
              <span className="font-bold">{a.who}</span> {a.what}
            </div>
          </div>
          <span className="text-[12.5px] text-muted-foreground/70 flex-none">
            {a.time}
          </span>
        </div>
      ))}
    </SettingsSection>
  );
}
