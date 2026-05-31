import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "QuickCart UAE — IT Products Store"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #072654 0%, #0a3d7a 100%)",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(0,102,186,0.25)",
            filter: "blur(80px)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0066BA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            🛒
          </div>
          <span
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            Quick<span style={{ color: "#4da6e8" }}>Cart</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          UAE&apos;s #1 IT Products Store
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            maxWidth: 750,
            marginBottom: 40,
          }}
        >
          Laptops · Gaming · Monitors · Networking · Components
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 24 }}>
          {["Free UAE Delivery", "Authentic Products", "UAE Warranty"].map((badge) => (
            <div
              key={badge}
              style={{
                padding: "10px 22px",
                borderRadius: 100,
                border: "1.5px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.08)",
                color: "#c8def5",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "rgba(255,255,255,0.35)",
          }}
        >
          quickcart.ae
        </div>

        {/* Red accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #ED1D32 0%, #0066BA 100%)",
          }}
        />
      </div>
    ),
    { ...size },
  )
}
