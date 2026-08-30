type DiamondProps = {
  size?: number;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
};

export function Diamond({
  size = 18,
  stroke = "#b0894a",
  fill = "none",
  strokeWidth = 1.5,
  className,
}: DiamondProps) {
  const solid = fill !== "none";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <g
        fill={fill}
        stroke={solid ? "none" : stroke}
        strokeWidth={strokeWidth}
      >
        <rect x="6" y="6" width="12" height="12" />
        <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
      </g>
    </svg>
  );
}
