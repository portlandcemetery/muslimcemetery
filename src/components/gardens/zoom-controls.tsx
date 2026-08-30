"use client";

import type { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const zoomBtn =
  "size-10 rounded-[10px] text-foreground/85 hover:bg-secondary hover:text-foreground";

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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M5 12h14" />
        </svg>
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.5 2.8L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </Button>
    </div>
  );
}
