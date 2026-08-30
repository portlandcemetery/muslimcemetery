export function MapHint() {
  return (
    <div className="absolute left-[22px] bottom-[22px] flex items-center gap-[9px] bg-card/90 border border-border rounded-xl py-[9px] px-[14px] text-[13px] text-muted-foreground pointer-events-none">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
      Drag to pan · scroll to zoom · click a plot to open its registry
    </div>
  );
}
