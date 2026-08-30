"use client";

import type { RefObject } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const zoomBtn =
  "size-10 rounded-[10px] text-foreground/85 hover:bg-secondary hover:text-foreground [&_svg]:size-[18px]";

export function ZoomControls({
  zoomRef,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  zoomRef: RefObject<HTMLSpanElement | null>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  return (
    <div
      data-nodrag
      className="absolute right-[22px] bottom-[22px] flex items-center gap-2 bg-card border border-border rounded-[14px] p-[6px] shadow-[0_12px_30px_-16px] shadow-foreground/50"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        onClick={onZoomOut}
        className={zoomBtn}
      >
        <Minus strokeWidth={2.2} />
      </Button>
      <span
        ref={zoomRef}
        className="min-w-[52px] text-center text-[13.5px] font-bold text-foreground/85"
      >
        85%
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        onClick={onZoomIn}
        className={zoomBtn}
      >
        <Plus strokeWidth={2.2} />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Reset view"
        title="Reset view"
        onClick={onReset}
        className={zoomBtn}
      >
        <RotateCcw strokeWidth={2} />
      </Button>
    </div>
  );
}
