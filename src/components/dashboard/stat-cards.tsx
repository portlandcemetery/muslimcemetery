import { Card } from "@/components/ui/card";

type Stat = { label: string; value: string; color: string };

const STATS: Stat[] = [
  { label: "Total Plots", value: "2,028", color: "text-foreground" },
  { label: "Occupied", value: "847", color: "text-chart-3" },
  { label: "Reserved", value: "234", color: "text-chart-4" },
  { label: "Available", value: "947", color: "text-primary" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[18px] mb-10">
      {STATS.map((s) => (
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
