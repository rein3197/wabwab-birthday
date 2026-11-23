import type { SVGProps } from "react";
import { RIBBON_PATHS, RIBBON_VIEWBOX } from "@/shared/ribbon-path";

export function RibbonGraphic({
  width = 56,
  height = 56,
  color = "#f472b6",
  accent = "#ec4899",
  className,
  ...rest
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  color?: string;
  accent?: string;
}) {
  return (
    <svg
      viewBox={RIBBON_VIEWBOX}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      {RIBBON_PATHS.map((d, i) => (
        <path key={i} d={d} fill={i === 0 ? color : accent} opacity={i === 0 ? 1 : 0.92} />
      ))}
    </svg>
  );
}