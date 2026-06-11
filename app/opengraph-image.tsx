import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data";

export const runtime = "nodejs";
// Cache the generated image; it changes rarely.
export const revalidate = 3600;

export const alt = "Krish Makadia — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#F4F0E4";
const INK = "#1A1712";
const INK_SOFT = "#4A453D";
const ORANGE = "#F04300";

/**
 * Load a Google font as TTF for Satori. Omitting a modern User-Agent makes
 * Google serve truetype (Satori can't read woff2). Returns null on failure.
 */
async function loadFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const src = css.match(
      /src:\s*url\((.+?)\)\s*format\('(?:opentype|truetype)'\)/
    )?.[1];
    if (!src) return null;
    const res = await fetch(src);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const profile = await getProfile().catch(() => null);
  const name = profile?.name ?? "Krish Makadia";
  const headline =
    profile?.headline ??
    "MS CS @ Stony Brook · Distributed Systems & Full-Stack Engineer";
  const handle = (profile?.githubUrl ?? "github.com/kiiriis").replace(
    /^https?:\/\//,
    ""
  );
  const stat = "526K";
  const statLabel = "COMMITTED TXNS / SECOND";
  const figure = "FIG. 00 — PORTFOLIO";
  const monogram = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  const serifText = `${name}${stat}`;
  const monoText = `${headline}${statLabel}${handle}${figure}${monogram}`;

  const [serif, mono] = await Promise.all([
    loadFont("Fraunces", 600, serifText),
    loadFont("IBM+Plex+Mono", 500, monoText),
  ]);

  const fonts = [
    ...(serif
      ? [{ name: "Fraunces", data: serif, weight: 600 as const, style: "normal" as const }]
      : []),
    ...(mono
      ? [{ name: "Plex", data: mono, weight: 500 as const, style: "normal" as const }]
      : []),
  ];

  const monoFamily = mono ? "Plex" : "monospace";
  const serifFamily = serif ? "Fraunces" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          padding: 64,
          backgroundColor: PAPER,
          color: INK,
          backgroundImage:
            "linear-gradient(rgba(26,23,18,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(26,23,18,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          fontFamily: monoFamily,
        }}
      >
        {/* Inset registration frame */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: `2px solid ${INK}`,
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              backgroundColor: ORANGE,
              color: PAPER,
              fontFamily: serifFamily,
              fontSize: 34,
              fontWeight: 600,
            }}
          >
            {monogram}
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 18,
              letterSpacing: 4,
              color: INK_SOFT,
            }}
          >
            {figure}
          </div>
        </div>

        {/* Center: name + headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: serifFamily,
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 26,
              color: INK_SOFT,
              marginTop: 24,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {headline}
          </div>
        </div>

        {/* Bottom row: stat + handle */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div
              style={{
                fontFamily: serifFamily,
                fontSize: 72,
                fontWeight: 600,
                color: ORANGE,
                lineHeight: 1,
              }}
            >
              {stat}
            </div>
            <div
              style={{
                fontFamily: monoFamily,
                fontSize: 16,
                letterSpacing: 3,
                color: INK_SOFT,
              }}
            >
              {statLabel}
            </div>
          </div>
          <div
            style={{
              fontFamily: monoFamily,
              fontSize: 20,
              color: INK,
            }}
          >
            {handle}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
