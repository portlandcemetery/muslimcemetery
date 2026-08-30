import { Info } from "lucide-react";

export function MapHint() {
  return (
    <div className="absolute left-[22px] bottom-[22px] hidden md:flex items-center gap-[9px] bg-card/90 border border-border rounded-xl py-[9px] px-[14px] text-[13px] text-muted-foreground pointer-events-none">
      <Info size={16} strokeWidth={2} className="text-primary" />
      Drag to pan · scroll to zoom · click a plot to open its registry
    </div>
  );
}
