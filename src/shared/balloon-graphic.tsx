import type { SVGProps } from "react";
import { BALLOON_PATHS, BALLOON_VIEWBOX } from "@/shared/balloon-path";

export function BalloonGraphic({
  width = 52,
  height = 52,
  color = "#f9a8d4",
  className,
  ...rest
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <svg
      viewBox={BALLOON_VIEWBOX}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      {BALLOON_PATHS.map((d, i) => (
        <path key={i} d={d} fill={color} opacity={i === 0 ? 1 : 0.88} />
      ))}
    </svg>
  );
}