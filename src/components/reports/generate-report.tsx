import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Report = { name: string; desc: string; icon: ReactNode };

function Icon({ d }: { d: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const REPORTS: Report[] = [
  { name: "Occupancy by Garden", desc: "Plot allocation and availability across every sector.", icon: <Icon d="M3 3v18h18" /> },
  { name: "Financial & Payments", desc: "Collected, outstanding, and scheduled installments.", icon: <Icon d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
  { name: "Burials Register", desc: "Chronological record of all recorded burials.", icon: <Icon d="M12 2v20M5 8c0-3 3-5 7-6M19 8c0-3-3-5-7-6" /> },
  { name: "Reservations", desc: "Active reservations grouped by payment status.", icon: <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /> },
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
            className="border-border rounded-2xl py-6 px-[26px] gap-0 flex-row items-start"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-none">
              {r.icon}
            </div>
            <div className="flex-1">
              <div className="font-bold text-[17px] mb-[3px]">{r.name}</div>
              <div className="text-[13.5px] text-muted-foreground/90 mb-4">
                {r.desc}
              </div>
              <div className="flex gap-[10px]">
                <Button variant="outline" className={exportBtn}>
                  Export CSV
                </Button>
                <Button variant="outline" className={exportBtn}>
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
