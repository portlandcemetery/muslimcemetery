import { SettingsSection } from "./settings-section";
import type { ActivityEntry } from "@/lib/types";

const ACTION_LABELS: Record<string, { text: string; dot: string }> = {
  "plots.update": { text: "updated plot", dot: "bg-chart-1" },
  "payments.insert": { text: "recorded a payment on plot", dot: "bg-chart-4" },
  "payments.delete": { text: "deleted a payment on plot", dot: "bg-chart-5" },
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function AuditLog({ entries }: { entries: ActivityEntry[] }) {
  return (
    <SettingsSection
      title="Audit Log"
      description="Every change, recorded automatically."
    >
      {entries.length === 0 && (
        <div className="py-[13px] border-t border-border text-[13.5px] text-muted-foreground">
          No activity recorded yet.
        </div>
      )}
      {entries.map((a) => {
        const meta = ACTION_LABELS[a.action] ?? {
          text: a.action,
          dot: "bg-chart-2",
        };
        return (
          <div key={a.id} className="flex gap-[14px] py-[13px] border-t border-border">
            <span className={`flex-none mt-[5px] w-[9px] h-[9px] rounded-full ${meta.dot}`} />
            <div className="flex-1">
              <div className="text-[14.5px] text-card-foreground">
                <span className="font-bold">{a.actor_name || "System"}</span>{" "}
                {meta.text}
                {a.plot_ref ? ` ${a.plot_ref}` : ""}
              </div>
            </div>
            <span className="text-[12.5px] text-muted-foreground/70 flex-none">
              {timeAgo(a.created_at)}
            </span>
          </div>
        );
      })}
    </SettingsSection>
  );
}
