import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SMARTX_APP_DESCRIPTION, SMARTX_HERO_TITLE } from "@/lib/site-metadata";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export async function GET() {
  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/consumer-network/logo-white.svg")),
    readFile(join(process.cwd(), "public/assets/fonts/Lexend-700.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          background: "#010101",
          color: "#f5f5f5",
          fontFamily: "Lexend",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 52 }}>
          {/* ImageResponse renders an SVG canvas, not a browser document. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
            alt=""
            width={64}
            height={53}
          />
          <span>SmartX</span>
        </div>
        <div style={{ display: "flex", fontSize: 64 }}>{SMARTX_HERO_TITLE}</div>
        <div style={{ display: "flex", fontSize: 24, color: "#c1cac7" }}>
          {SMARTX_APP_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Lexend", data: font, weight: 700 }] },
  );
}
