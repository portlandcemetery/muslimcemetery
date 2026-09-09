"use client";

import { toast } from "sonner";
import { Download, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlotDocument } from "@/lib/types";
import { SectionHeading } from "./section-heading";

const SOON = "Document storage is coming soon.";

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Phase 2 (Cloudflare R2): upload/download/delete are deferred. Existing rows
// still render; actions surface a "coming soon" notice.
export function AttachedDocuments({
  documents,
  readOnly,
}: {
  documents: PlotDocument[];
  readOnly: boolean;
}) {
  return (
    <>
      <SectionHeading title="Attached Documents" small />
      {documents.length === 0 ? (
        <div className="mb-[14px] text-[13.5px] text-muted-foreground/80 bg-white/40 border border-dashed border-border rounded-[11px] py-4 px-[14px] flex items-center gap-3">
          <Paperclip size={18} strokeWidth={2} className="text-primary flex-none" />
          No documents attached yet.
        </div>
      ) : (
        <div className="flex flex-col gap-[10px] mb-[14px]">
          {documents.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-3 bg-white/50 border border-border rounded-[11px] py-3 px-[14px]"
            >
              <Paperclip size={18} strokeWidth={2} className="text-primary flex-none" />
              <span className="flex-1 min-w-0 text-left text-sm font-medium text-card-foreground truncate">
                {d.file_name}
              </span>
              <span className="text-[12.5px] text-muted-foreground/70 flex-none">
                {fmtSize(d.size_bytes)}
              </span>
              <button
                type="button"
                onClick={() => toast.info(SOON)}
                aria-label={`Download ${d.file_name}`}
                className="flex-none text-muted-foreground/60 hover:text-primary transition-colors"
              >
                <Download size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <Button
          variant="outline"
          type="button"
          onClick={() => toast.info(SOON)}
          className="w-full h-auto py-[13px] bg-transparent border-[1.5px] border-dashed border-accent/60 rounded-[11px] text-[14.5px] font-semibold text-primary hover:bg-primary-foreground hover:border-primary hover:text-primary"
        >
          + Upload Document
        </Button>
      )}
    </>
  );
}
