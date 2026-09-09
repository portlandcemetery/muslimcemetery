import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/services/db/aggregates";

const fmt = (n: number) => n.toLocaleString("en-US");

export function StatCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Plots", value: fmt(stats.total), color: "text-foreground" },
    { label: "Occupied", value: fmt(stats.occupied), color: "text-chart-3" },
    { label: "Reserved", value: fmt(stats.reserved), color: "text-chart-4" },
    { label: "Available", value: fmt(stats.available), color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-10">
      {cards.map((s) => (
        <Card
          key={s.label}
          className="border-border rounded-2xl py-[22px] px-6 gap-0"
        >
          <div className="flex items-center gap-[9px] mb-4">
            <span className={`w-[9px] h-[9px] rounded-[2px] bg-current ${s.color}`} />
            <span className="text-[12.5px] font-bold tracking-[0.09em] uppercase text-muted-foreground/90">
              {s.label}
            </span>
          </div>
          <div className={`text-[30px] sm:text-[40px] font-extrabold tracking-[-0.02em] ${s.color}`}>
            {s.value}
          </div>
        </Card>
      ))}
    </div>
  );
}
