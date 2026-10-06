import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image d'aperçu (1200x630) générée au build : WhatsApp, LinkedIn, Facebook, X, Google.
export const alt =
  "Foukeng Kemayou Bavel Franck (FKBF) — Développeur Web Fullstack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const icon = await readFile(
    join(process.cwd(), "public/images/icons/icon-512x512.png"),
  );
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: 80,
        background: "linear-gradient(135deg, #08091a 0%, #1b1f4b 100%)",
        color: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconSrc}
        width={220}
        height={220}
        style={{ borderRadius: 44, marginRight: 64 }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 30, color: "#a5b4fc", letterSpacing: 4 }}>
          PORTFOLIO
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 16,
          }}
        >
          Foukeng Kemayou Bavel Franck
        </div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#cbd5e1" }}>
          Développeur Web Fullstack · Douala, Cameroun
        </div>
      </div>
    </div>,
    { ...size },
  );
}
