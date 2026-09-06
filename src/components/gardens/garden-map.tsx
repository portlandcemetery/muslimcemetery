"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLS, type Row } from "./garden-data";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlotCell } from "./plot-cell";
import { ZoomControls } from "./zoom-controls";
import { MapHint } from "./map-hint";

const MIN_SCALE = 0.35;
const MAX_SCALE = 3;

export function GardenMap({
  rows,
  gardenId,
  isAdmin,
  canFocusMine = false,
}: {
  rows: Row[];
  gardenId: string;
  isAdmin: boolean;
  canFocusMine?: boolean;
}) {
  const [focusMine, setFocusMine] = useState(false);
  const vpRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const view = useRef({ scale: 1.2, tx: 30, ty: 16 });

  const apply = useCallback(() => {
    const { scale, tx, ty } = view.current;
    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    }
    if (zoomRef.current) {
      zoomRef.current.textContent = `${Math.round(scale * 100)}%`;
    }
  }, []);

  const zoomAt = useCallback(
    (next: number) => {
      const vp = vpRef.current;
      if (!vp) return;
      const r = vp.getBoundingClientRect();
      const mx = r.width / 2;
      const my = r.height / 2;
      const v = view.current;
      const k = next / v.scale;
      v.tx = mx - (mx - v.tx) * k;
      v.ty = my - (my - v.ty) * k;
      v.scale = next;
      apply();
    },
    [apply]
  );

  const zoomIn = useCallback(
    () => zoomAt(Math.min(MAX_SCALE, view.current.scale * 1.2)),
    [zoomAt]
  );
  const zoomOut = useCallback(
    () => zoomAt(Math.max(MIN_SCALE, view.current.scale / 1.2)),
    [zoomAt]
  );
  const reset = useCallback(() => {
    view.current = { scale: 1.2, tx: 30, ty: 16 };
    apply();
  }, [apply]);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    apply();

    let drag: { x: number; y: number; tx: number; ty: number; moved: boolean } | null =
      null;
    let suppressClick = false;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      const v = view.current;
      const f = Math.exp(-e.deltaY * 0.0015);
      const ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * f));
      const k = ns / v.scale;
      v.tx = mx - (mx - v.tx) * k;
      v.ty = my - (my - v.ty) * k;
      v.scale = ns;
      apply();
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("[data-nodrag]")) return;
      const v = view.current;
      drag = { x: e.clientX, y: e.clientY, tx: v.tx, ty: v.ty, moved: false };
      vp.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      view.current.tx = drag.tx + dx;
      view.current.ty = drag.ty + dy;
      apply();
    };
    const onUp = () => {
      if (!drag) return;
      suppressClick = drag.moved;
      vp.style.cursor = "grab";
      drag = null;
    };
    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    vp.addEventListener("click", onClick, true);
    return () => {
      vp.removeEventListener("wheel", onWheel);
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      vp.removeEventListener("click", onClick, true);
    };
  }, [apply]);

  return (
    <div
      ref={vpRef}
      className="relative flex-1 overflow-hidden cursor-grab touch-none select-none bg-secondary [background-image:radial-gradient(var(--input)_1.4px,transparent_1.4px)] [background-size:26px_26px]"
    >
      <TooltipProvider delay={0} closeDelay={0}>
      <div
        ref={canvasRef}
        className="absolute top-0 left-0 origin-top-left will-change-transform py-[34px] px-[44px]"
      >
        <div className="flex gap-4 pl-[50px] mb-3">
          {COLS.map((c) => (
            <div
              key={c}
              className="w-[240px] flex-none text-center font-extrabold text-lg text-primary tracking-[0.04em]"
            >
              {c}
            </div>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.letter} className="flex gap-4 items-stretch mb-4">
            <div className="w-[34px] flex-none flex items-center justify-center font-extrabold text-lg text-primary">
              {row.letter}
            </div>
            {row.cells.map((cell) => (
              <PlotCell
                key={cell.coord}
                cell={cell}
                gardenId={gardenId}
                isAdmin={isAdmin}
                dimOthers={focusMine}
              />
            ))}
          </div>
        ))}
      </div>
      </TooltipProvider>

      {canFocusMine && (
        <Button
          type="button"
          variant={focusMine ? "default" : "outline"}
          data-nodrag
          onClick={() => setFocusMine((f) => !f)}
          className="absolute right-5 top-5 h-auto py-[10px] px-4 rounded-full text-[13.5px] font-semibold shadow-[0_10px_24px_-16px_rgba(34,39,31,.6)]"
        >
          <Eye size={16} strokeWidth={2} />
          {focusMine ? "Showing my plots" : "Find my plots"}
        </Button>
      )}
      <ZoomControls
        zoomRef={zoomRef}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={reset}
      />
      <MapHint />
    </div>
  );
}
