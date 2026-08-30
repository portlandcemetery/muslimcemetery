import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

type ExportRow = { name: string; by: string; date: string; size: string };

const EXPORTS: ExportRow[] = [
  { name: "al-jannah-full-backup-2025-08-22.zip", by: "Automatic weekly", date: "Aug 22, 2025", size: "214 MB" },
  { name: "financial-report-jul-2025.pdf", by: "S. Yusuf", date: "Aug 3, 2025", size: "1.2 MB" },
  { name: "burials-register-q2-2025.csv", by: "A. Rahman", date: "Jul 12, 2025", size: "486 KB" },
  { name: "al-jannah-full-backup-2025-08-15.zip", by: "Automatic weekly", date: "Aug 15, 2025", size: "209 MB" },
];

export function RecentExports() {
  return (
    <>
      <h2 className="font-extrabold text-2xl tracking-[-0.01em] mb-[18px]">
        Recent Exports
      </h2>
      <Card className="border-border rounded-2xl p-0 gap-0 overflow-hidden">
        {EXPORTS.map((e) => (
          <div
            key={e.name}
            className="flex items-center gap-4 py-4 px-6 border-b border-border last:border-b-0"
          >
            <FileText size={18} strokeWidth={2} className="text-primary flex-none" />
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-semibold text-card-foreground truncate">
                {e.name}
              </div>
              <div className="text-[12.5px] text-muted-foreground/90">
                {e.by} · {e.date}
              </div>
            </div>
            <span className="text-[12.5px] text-muted-foreground/70 flex-none">
              {e.size}
            </span>
            <a
              href="#"
              className="text-[13.5px] font-semibold text-primary hover:text-primary/80 flex-none"
            >
              Download
            </a>
          </div>
        ))}
      </Card>
    </>
  );
}
