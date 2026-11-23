import { ImageResponse } from "next/og";
import { pwaIconElement } from "@/shared/pwa-icon-markup";

export const runtime = "edge";

const ALLOWED = new Set(["192", "512"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const { size: raw } = await context.params;
  const px = ALLOWED.has(raw) ? Number(raw) : 192;

  return new ImageResponse(pwaIconElement(px), {
    width: px,
    height: px,
  });
}