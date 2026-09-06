import { Card } from "@/components/ui/card";
import type { ReportStats as ReportStatsData } from "@/lib/data/reports";

type Stat = { label: string; value: string; sub: string; color: string };

const fmt = (n: number) => n.toLocaleString("en-US");

export function ReportStats({ stats }: { stats: ReportStatsData }) {
  const cards: Stat[] = [
    {
      label: "Total Burials",
      value: fmt(stats.totalBurials),
      sub: `+${fmt(stats.burialsThisMonth)} this month`,
      color: "text-chart-3",
    },
    {
      label: "Active Reservations",
      value: fmt(stats.activeReservations),
      sub: `${fmt(stats.pendingPayment)} pending payment`,
      color: "text-chart-2",
    },
    {
      label: "Payments Collected",
      value: `$${fmt(Math.round(stats.paymentsYtd))}`,
      sub: "Year to date",
      color: "text-primary",
    },
    {
      label: "Occupancy Rate",
      value: `${(stats.occupancyRate * 100).toFixed(1)}%`,
      sub: `${fmt(stats.totalPlots)} total plots`,
      color: "text-chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-[34px]">
      {cards.map((s) => (
        <Card key={s.label} className="border-border rounded-2xl py-5 px-[22px] gap-0">
          <div className="text-[12.5px] font-bold tracking-[0.08em] uppercase text-muted-foreground/90 mb-3">
            {s.label}
          </div>
          <div className={`text-[26px] sm:text-[32px] font-extrabold tracking-[-0.02em] ${s.color}`}>
            {s.value}
          </div>
          <div className="text-[13px] text-muted-foreground/90 mt-1">{s.sub}</div>
        </Card>
      ))}
    </div>
  );
}
