import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { loadInviterShareCard } from "@/lib/waitlist/public-share";

export const dynamic = "force-dynamic";

const COLORS = {
  canvas: "#010101",
  line: "#202627",
  text: "#f5f5f5",
  muted: "#747474",
  mint: "#08dfb5",
};

const AXES = [
  { key: "conviction", label: "Conviction", fill: "#08dfb5", track: "rgba(8, 223, 181, 0.12)" },
  { key: "instinct", label: "Instinct", fill: "#a957d6", track: "rgba(169, 87, 214, 0.2)" },
  { key: "resilience", label: "Resilience", fill: "#f69002", track: "rgba(246, 144, 2, 0.14)" },
] as const;

// 冷启动只读一次；satori 不认 woff2，这两份 woff 随仓库分发。
let fontsPromise: Promise<{ regular: Buffer; semibold: Buffer }> | null = null;
function loadFonts() {
  fontsPromise ??= (async () => {
    const dir = path.join(process.cwd(), "src/assets/fonts");
    const [regular, semibold] = await Promise.all([
      readFile(path.join(dir, "ibm-plex-serif-latin-400-normal.woff")),
      readFile(path.join(dir, "ibm-plex-serif-latin-600-normal.woff")),
    ]);
    return { regular, semibold };
  })();
  return fontsPromise;
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const card = await loadInviterShareCard(request.nextUrl.searchParams.get("invite"));
  if (!card) {
    return Response.redirect(new URL("/opengraph-image.png", origin), 302);
  }

  const artUrl = card.artSrc.startsWith("/") ? `${origin}${card.artSrc}` : card.artSrc;
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 56,
          background: COLORS.canvas,
          color: COLORS.text,
          fontFamily: '"IBM Plex Serif"',
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            paddingRight: 48,
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ color: COLORS.mint, fontSize: 26, fontWeight: 600, letterSpacing: 4 }}>
              SMARTX
            </span>
            <span style={{ color: COLORS.muted, fontSize: 19, letterSpacing: 4 }}>
              TRADER TYPE
            </span>
          </div>

          {card.poles.length ? (
            <div
              style={{
                display: "flex",
                marginTop: 34,
                color: COLORS.mint,
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: 3,
              }}
            >
              {card.poles.join(" · ")}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              marginTop: 14,
              fontSize: 62,
              fontWeight: 600,
              lineHeight: 1.08,
            }}
          >
            {card.name}
          </div>

          {card.roast ? (
            <div
              style={{
                display: "flex",
                marginTop: 22,
                color: COLORS.mint,
                fontSize: 25,
                lineHeight: 1.35,
                maxHeight: 140,
                overflow: "hidden",
              }}
            >
              {`“${card.roast}”`}
            </div>
          ) : null}

          <div style={{ flex: 1, display: "flex" }} />

          <div style={{ display: "flex", gap: 26 }}>
            {AXES.map((axis) => {
              const value = Math.max(0, Math.min(100, card.stats[axis.key]));
              return (
                <div
                  key={axis.key}
                  style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span style={{ color: COLORS.muted, fontSize: 17 }}>{axis.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 600 }}>{value}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 10,
                      height: 8,
                      borderRadius: 4,
                      background: axis.track,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(value, 4)}%`,
                        height: 8,
                        borderRadius: 4,
                        background: axis.fill,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 460,
            height: 460,
            alignSelf: "center",
            borderRadius: 24,
            border: `1px solid ${COLORS.line}`,
            background: "#0a0f0f",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- satori 画布内只能用原生 img */}
          <img
            src={artUrl}
            alt=""
            width={460}
            height={460}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "IBM Plex Serif", data: fonts.regular, weight: 400, style: "normal" },
        { name: "IBM Plex Serif", data: fonts.semibold, weight: 600, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
