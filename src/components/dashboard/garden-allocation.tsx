import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Diamond } from "@/components/diamond";

type Garden = {
  name: string;
  arabic: string;
  total: number;
  occupied: number;
  reserved: number;
  available: number;
};

const RAW: Omit<Garden, never>[] = [
  { name: "Garden A – Al-Firdaus", arabic: "الفردوس", total: 800, occupied: 420, reserved: 110, available: 270 },
  { name: "Garden B – Al-Kawthar", arabic: "الكوثر", total: 628, occupied: 280, reserved: 84, available: 264 },
  { name: "Garden C – Ar-Rawdah", arabic: "الروضة", total: 600, occupied: 147, reserved: 40, available: 413 },
];

const pct = (n: number, total: number) => `${((n / total) * 100).toFixed(2)}%`;

const LEGEND = [
  { key: "occupied", label: "Occupied", dot: "bg-chart-3" },
  { key: "reserved", label: "Reserved", dot: "bg-chart-2" },
  { key: "available", label: "Available", dot: "bg-chart-1" },
] as const;

export function GardenAllocation() {
  return (
    <div>
      <div className="flex items-center gap-[14px] mb-5">
        <h2 className="font-extrabold text-2xl tracking-[-0.01em]">
          Plot Allocation by Garden Sector
        </h2>
        <Diamond size={16} className="text-accent flex-none" />
      </div>

      <div className="flex flex-col gap-4">
        {RAW.map((g) => (
          <Link key={g.name} href="/gardens" className="block">
            <Card className="border-border rounded-2xl py-[26px] px-7 gap-0 transition-shadow hover:border-accent hover:shadow-[0_14px_34px_-26px_rgba(34,39,31,.5)]">
              <div className="flex items-start justify-between gap-4 mb-[18px]">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-bold text-xl tracking-[-0.01em] text-foreground">
                    {g.name}
                  </h3>
                  <span className="font-arabic text-[22px] text-primary">
                    {g.arabic}
                  </span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground flex-none">
                  {g.total} plots
                </span>
              </div>

              <div className="flex h-3 rounded-full overflow-hidden bg-border mb-4">
                <span className="bg-chart-3" style={{ width: pct(g.occupied, g.total) }} />
                <span className="bg-chart-2" style={{ width: pct(g.reserved, g.total) }} />
                <span className="bg-chart-1" style={{ width: pct(g.available, g.total) }} />
              </div>

              <div className="flex gap-[26px] flex-wrap">
                {LEGEND.map((l) => (
                  <span
                    key={l.key}
                    className="flex items-center gap-2 text-sm text-foreground/85"
                  >
                    <span className={`w-[9px] h-[9px] rounded-[2px] ${l.dot}`} />
                    {l.label} {g[l.key]}
                  </span>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
