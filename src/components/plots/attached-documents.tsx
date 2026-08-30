import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";

const DOCS = [
  { name: "burial_permit_ahmad_hassan.pdf", size: "2.4 MB" },
  { name: "deed_transfer_signed.pdf", size: "1.1 MB" },
];

export function AttachedDocuments() {
  return (
    <>
      <SectionHeading title="Attached Documents" small />
      <div className="flex flex-col gap-[10px] mb-[14px]">
        {DOCS.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-3 bg-white/50 border border-border rounded-[11px] py-3 px-[14px]"
          >
            <Paperclip size={18} strokeWidth={2} className="text-primary flex-none" />
            <span className="flex-1 min-w-0 text-sm font-medium text-card-foreground truncate">
              {d.name}
            </span>
            <span className="text-[12.5px] text-muted-foreground/70 flex-none">
              {d.size}
            </span>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full h-auto py-[13px] bg-transparent border-[1.5px] border-dashed border-accent/60 rounded-[11px] text-[14.5px] font-semibold text-primary hover:bg-primary-foreground hover:border-primary hover:text-primary"
      >
        + Upload Document
      </Button>
    </>
  );
}
