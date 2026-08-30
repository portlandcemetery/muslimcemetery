type DiamondProps = {
  size?: number;
  variant?: "stroke" | "fill";
  strokeWidth?: number;
  className?: string;
};

/** Brand diamond motif. Color comes from the current text color (set via a
 *  text-* token class), so it stays on shadcn tokens. */
export function Diamond({
  size = 18,
  variant = "stroke",
  strokeWidth = 1.5,
  className,
}: DiamondProps) {
  const solid = variant === "fill";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <g
        fill={solid ? "currentColor" : "none"}
        stroke={solid ? "none" : "currentColor"}
        strokeWidth={strokeWidth}
      >
        <rect x="6" y="6" width="12" height="12" />
        <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      </g>
    </svg>
  );
}
