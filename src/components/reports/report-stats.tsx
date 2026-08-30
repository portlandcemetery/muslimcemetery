import { Card } from "@/components/ui/card";

type Stat = { label: string; value: string; sub: string; color: string };

const STATS: Stat[] = [
  { label: "Total Burials", value: "847", sub: "+12 this month", color: "text-chart-3" },
  { label: "Active Reservations", value: "234", sub: "18 pending payment", color: "text-chart-2" },
  { label: "Payments Collected", value: "$1.84M", sub: "Year to date", color: "text-primary" },
  { label: "Occupancy Rate", value: "53.3%", sub: "2,028 total plots", color: "text-chart-5" },
];

export function ReportStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-[34px]">
      {STATS.map((s) => (
        <Card key={s.label} className="border-border rounded-2xl py-5 px-[22px] gap-0">
          <div className="text-[12.5px] font-bold tracking-[0.08em] uppercase text-muted-foreground/90 mb-3">
            {s.label}
          </div>
          <div className={`text-[32px] font-extrabold tracking-[-0.02em] ${s.color}`}>
            {s.value}
          </div>
          <div className="text-[13px] text-muted-foreground/90 mt-1">{s.sub}</div>
        </Card>
      ))}
    </div>
  );
}
