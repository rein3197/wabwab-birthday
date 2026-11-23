import { TulipGraphic } from "@/shared/tulip-graphic";

/** PWA PNG tile: tulip only (no filled background). */
export function pwaIconElement(size: number) {
  const tulipSize = size * 0.92;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <TulipGraphic width={tulipSize} height={tulipSize} gradientId="tulip-pwa" />
    </div>
  );
}