import {
  ChartColumn,
  DollarSign,
  Sprout,
  SquareCheckBig,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReportType } from "@/lib/data/reports";

type Report = { name: string; desc: string; icon: LucideIcon; type: ReportType };

const REPORTS: Report[] = [
  { name: "Occupancy by Garden", desc: "Plot allocation and availability across every sector.", icon: ChartColumn, type: "occupancy" },
  { name: "Financial & Payments", desc: "Collected, outstanding, and scheduled installments.", icon: DollarSign, type: "financial" },
  { name: "Burials Register", desc: "Chronological record of all recorded burials.", icon: Sprout, type: "burials" },
  { name: "Reservations", desc: "Active reservations grouped by payment status.", icon: SquareCheckBig, type: "reservations" },
];

const exportBtn =
  "h-auto py-[9px] px-4 text-[13.5px] font-semibold rounded-[9px] bg-card border border-input text-card-foreground hover:bg-card hover:border-primary hover:text-primary";

export function GenerateReport() {
  return (
    <>
      <h2 className="font-extrabold text-2xl tracking-[-0.01em] mb-[18px]">
        Generate a Report
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-[34px]">
        {REPORTS.map((r) => (
          <Card
            key={r.name}
            className="border-border rounded-2xl py-6 px-[26px] gap-[18px] flex-row items-start"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-none">
              <r.icon size={22} strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-[17px] mb-[3px]">{r.name}</div>
              <div className="text-[13.5px] text-muted-foreground/90 mb-4">
                {r.desc}
              </div>
              <div className="flex gap-[10px]">
                <Button
                  variant="outline"
                  className={exportBtn}
                  render={<a href={`/reports/export?type=${r.type}`} download />}
                >
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  className={exportBtn}
                  disabled
                  title="PDF export coming soon"
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
