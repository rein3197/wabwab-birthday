import type { SVGProps } from "react";
import { TULIP_SVG_PATH, TULIP_VIEWBOX } from "@/shared/tulip-path";

export { TULIP_VIEWBOX };

export function TulipGraphic({
  width,
  height,
  className,
  gradientId = "tulip-grad",
  ...rest
}: SVGProps<SVGSVGElement> & {
  width?: number;
  height?: number;
  gradientId?: string;
}) {
  return (
    <svg
      viewBox={TULIP_VIEWBOX}
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="612" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="42%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path d={TULIP_SVG_PATH} fill={`url(#${gradientId})`} />
    </svg>
  );
}