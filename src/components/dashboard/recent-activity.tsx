import { Card } from "@/components/ui/card";
import type { ActivityEntry } from "@/lib/types";

const ACTION_META: Record<string, { label: string; dot: string }> = {
  "plots.update": { label: "Plot record updated", dot: "bg-chart-1" },
  "payments.insert": { label: "Payment recorded", dot: "bg-chart-4" },
  "payments.delete": { label: "Payment deleted", dot: "bg-chart-5" },
};

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentActivity({ entries }: { entries: ActivityEntry[] }) {
  return (
    <Card className="border-border rounded-2xl pt-6 px-6 pb-[10px] gap-0">
      <h2 className="font-extrabold text-xl tracking-[-0.01em] mb-[6px]">
        Recent Activity
      </h2>
      <p className="text-[13px] text-muted-foreground/90 mb-[14px]">
        Audit log · last changes
      </p>
      {entries.length === 0 && (
        <div className="py-[14px] text-[13.5px] text-muted-foreground">
          No activity recorded yet.
        </div>
      )}
      {entries.map((a) => {
        const meta = ACTION_META[a.action] ?? {
          label: a.action,
          dot: "bg-chart-2",
        };
        return (
          <div
            key={a.id}
            className="flex gap-3 py-[14px] border-b border-border last:border-b-0"
          >
            <span className={`flex-none mt-[5px] w-[9px] h-[9px] rounded-full ${meta.dot}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-[14.5px] text-foreground">
                  {a.plot_ref ? `Plot ${a.plot_ref}` : a.entity}
                </span>
                <span className="text-xs text-muted-foreground/70 flex-none">
                  {timeAgo(a.created_at)}
                </span>
              </div>
              <div className="text-[13.5px] text-muted-foreground mt-[2px]">
                {meta.label}
                {a.actor_name ? ` · ${a.actor_name}` : ""}
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
