import { ImageResponse } from "next/og";
import { readPortfolio } from "@/lib/portfolio-store";

export const runtime = "nodejs";
export const alt = "Shabbar Abbas — Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  let name = "Shabbar Abbas";
  let title = "Full-Stack Engineer & Laravel Specialist";
  try {
    const { site } = await readPortfolio();
    name = site.fullName;
    title = site.title;
  } catch {
    // fallbacks above
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(145deg, #2a160c 0%, #120b08 55%, #070504 100%)",
          color: "#fff2df",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #e6bd82, #c47d45)",
              color: "#1d1009",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            SA
          </div>
          <div style={{ fontSize: 28, color: "#e6bd82", letterSpacing: 4, textTransform: "uppercase" }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontSize: 32, color: "#d49a57", maxWidth: 900 }}>{title}</div>
        </div>

        <div style={{ fontSize: 22, color: "rgba(239,222,201,0.72)" }}>
          Laravel · Nuxt · Python · APIs · IconMarvel
        </div>
      </div>
    ),
    { ...size },
  );
}
