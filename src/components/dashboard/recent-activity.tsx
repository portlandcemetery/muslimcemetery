import { Card } from "@/components/ui/card";

type Activity = {
  plot: string;
  action: string;
  by: string;
  time: string;
  dot: string;
};

const ACTIVITY: Activity[] = [
  { plot: "AA-104", action: "Burial recorded", by: "A. Rahman", time: "2h ago", dot: "bg-chart-3" },
  { plot: "KC-42", action: "Reservation confirmed", by: "S. Yusuf", time: "4h ago", dot: "bg-chart-4" },
  { plot: "AB-89", action: "Burial recorded", by: "A. Rahman", time: "1d ago", dot: "bg-chart-3" },
  { plot: "RD-12", action: "Deed transfer", by: "M. Idris", time: "1d ago", dot: "bg-chart-1" },
  { plot: "AA-210", action: "Reservation confirmed", by: "S. Yusuf", time: "2d ago", dot: "bg-chart-4" },
  { plot: "KC-95", action: "Maintenance completed", by: "Grounds team", time: "2d ago", dot: "bg-chart-5" },
  { plot: "AB-11", action: "Burial recorded", by: "A. Rahman", time: "3d ago", dot: "bg-chart-3" },
  { plot: "RD-88", action: "Reservation confirmed", by: "S. Yusuf", time: "3d ago", dot: "bg-chart-4" },
];

export function RecentActivity() {
  return (
    <Card className="border-border rounded-2xl pt-6 px-6 pb-[10px] gap-0">
      <h2 className="font-extrabold text-xl tracking-[-0.01em] mb-[6px]">
        Recent Activity
      </h2>
      <p className="text-[13px] text-muted-foreground/90 mb-[14px]">
        Audit log · last changes
      </p>
      {ACTIVITY.map((a, i) => (
        <div
          key={i}
          className="flex gap-3 py-[14px] border-b border-border last:border-b-0"
        >
          <span className={`flex-none mt-[5px] w-[9px] h-[9px] rounded-full ${a.dot}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-[14.5px] text-foreground">
                Plot {a.plot}
              </span>
              <span className="text-xs text-muted-foreground/70 flex-none">
                {a.time}
              </span>
            </div>
            <div className="text-[13.5px] text-muted-foreground mt-[2px]">
              {a.action} · {a.by}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
