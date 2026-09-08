"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  pending = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-6 gap-0" showCloseButton={false}>
        <DialogHeader className="p-0 mb-2 flex-row items-start gap-3">
          <span className="flex-none mt-[2px] flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert size={18} strokeWidth={2} />
          </span>
          <div>
            <DialogTitle className="text-[16px] font-bold">{title}</DialogTitle>
            <DialogDescription className="mt-1 text-[13.5px] leading-[1.5]">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-[10px]">
          <DialogClose
            disabled={pending}
            render={
              <Button
                variant="outline"
                className="h-auto py-[10px] px-5 rounded-[11px] text-[14px] font-semibold"
              />
            }
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
            className="h-auto py-[10px] px-5 rounded-[11px] text-[14px] font-bold"
          >
            {pending ? "Working…" : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
