"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Loader2, Paperclip, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import type { PlotDocument } from "@/lib/types";
import { SectionHeading } from "./section-heading";

const MAX_SIZE_MB = 20;

function makeStoragePath(plotId: string, fileName: string): string {
  const safeName = fileName.replace(/[^\w.\-() ]+/g, "_");
  return `${plotId}/${Date.now()}-${safeName}`;
}

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachedDocuments({
  plotId,
  documents,
  readOnly,
}: {
  plotId: string;
  documents: PlotDocument[];
  readOnly: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = useRef(createClient());
  const [uploading, setUploading] = useState(false);
  const [busy, startBusy] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<PlotDocument | null>(null);

  async function upload(file: File) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File is too large — the limit is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const path = makeStoragePath(plotId, file.name);
      const { error: storageError } = await supabase.current.storage
        .from("plot-documents")
        .upload(path, file, { contentType: file.type || undefined });
      if (storageError) throw new Error(storageError.message);

      const { error: rowError } = await supabase.current.from("documents").insert({
        plot_id: plotId,
        storage_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (rowError) throw new Error(rowError.message);

      toast.success(`"${file.name}" uploaded.`);
      router.refresh();
    } catch (e) {
      toast.error(`Upload failed: ${e instanceof Error ? e.message : "unknown error"}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function download(doc: PlotDocument) {
    const { data, error } = await supabase.current.storage
      .from("plot-documents")
      .createSignedUrl(doc.storage_path, 3600);
    if (error || !data?.signedUrl) {
      toast.error("Could not open the document.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

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
              <button
                type="button"
                onClick={() => download(d)}
                className="flex-1 min-w-0 text-left text-sm font-medium text-card-foreground truncate hover:text-primary transition-colors"
                title={`Open ${d.file_name}`}
              >
                {d.file_name}
              </button>
              <span className="text-[12.5px] text-muted-foreground/70 flex-none">
                {fmtSize(d.size_bytes)}
              </span>
              <button
                type="button"
                onClick={() => download(d)}
                aria-label={`Download ${d.file_name}`}
                className="flex-none text-muted-foreground/60 hover:text-primary transition-colors"
              >
                <Download size={16} strokeWidth={2} />
              </button>
              {!readOnly && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setDeleteTarget(d)}
                  aria-label={`Delete ${d.file_name}`}
                  className="flex-none text-muted-foreground/60 hover:text-destructive transition-colors disabled:opacity-40"
                >
                  <Trash2 size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!readOnly && (
        <>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
            }}
          />
          <Button
            variant="outline"
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full h-auto py-[13px] bg-transparent border-[1.5px] border-dashed border-accent/60 rounded-[11px] text-[14.5px] font-semibold text-primary hover:bg-primary-foreground hover:border-primary hover:text-primary"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Uploading…
              </>
            ) : (
              "+ Upload Document"
            )}
          </Button>

          <ConfirmDialog
            open={deleteTarget !== null}
            onOpenChange={(next) => {
              if (!next) setDeleteTarget(null);
            }}
            title={`Delete "${deleteTarget?.file_name ?? ""}"?`}
            description="The file will be permanently removed from this plot's records. This cannot be undone."
            confirmLabel="Delete Document"
            pending={busy}
            onConfirm={() => {
              const target = deleteTarget;
              if (!target) return;
              startBusy(async () => {
                const { error: storageError } = await supabase.current.storage
                  .from("plot-documents")
                  .remove([target.storage_path]);
                const { error: rowError } = await supabase.current
                  .from("documents")
                  .delete()
                  .eq("id", target.id);
                if (storageError || rowError) {
                  toast.error(
                    `Delete failed: ${(storageError ?? rowError)?.message}`
                  );
                } else {
                  toast.success(`"${target.file_name}" deleted.`);
                  router.refresh();
                }
                setDeleteTarget(null);
              });
            }}
          />
        </>
      )}
    </>
  );
}
