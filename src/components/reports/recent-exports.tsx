import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReportExport } from "@/services/trpc/routers/reports";

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentExports({ exports }: { exports: ReportExport[] }) {
  return (
    <>
      <h2 className="font-extrabold text-2xl tracking-[-0.01em] mb-[18px]">
        Recent Exports
      </h2>
      <Card className="border-border rounded-2xl p-0 gap-0 overflow-hidden">
        {exports.length === 0 && (
          <div className="py-5 px-6 text-[14px] text-muted-foreground">
            No exports yet — generate a report above and it will be recorded
            here.
          </div>
        )}
        {exports.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-4 py-4 px-6 border-b border-border last:border-b-0"
          >
            <FileText size={18} strokeWidth={2} className="text-primary flex-none" />
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-semibold text-card-foreground truncate">
                {e.file_name}
              </div>
              <div className="text-[12.5px] text-muted-foreground/90">
                {e.exported_by_name ?? "Unknown"} · {fmtDate(e.created_at)}
              </div>
            </div>
            <span className="text-[12.5px] text-muted-foreground/70 flex-none">
              {fmtSize(e.size_bytes)}
            </span>
            <a
              href={`/reports/export?type=${e.report_type}`}
              title="Regenerates the report with current data"
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
