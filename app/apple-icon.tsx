import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #2a160c 0%, #120b08 100%)",
          borderRadius: 40,
          border: "6px solid #d49a57",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#e6bd82",
            letterSpacing: 2,
            fontFamily: "Georgia, serif",
          }}
        >
          SA
        </div>
      </div>
    ),
    { ...size },
  );
}
