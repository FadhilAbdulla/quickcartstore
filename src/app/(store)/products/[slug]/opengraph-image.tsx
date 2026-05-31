import { ImageResponse } from "next/og"
import { db } from "@/lib/db"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true, category: true },
  })

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#072654",
            color: "#ffffff",
            fontSize: 40,
          }}
        >
          QuickCart UAE
        </div>
      ),
      { ...size },
    )
  }

  const price = Number(product.price).toLocaleString("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
  })

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #072654 0%, #0a3d7a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left — product info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px 48px",
          }}
        >
          {/* Brand + category */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                background: "rgba(0,102,186,0.35)",
                border: "1px solid rgba(0,102,186,0.5)",
                color: "#7ec8f5",
                fontSize: 15,
                fontWeight: 600,
                padding: "5px 14px",
                borderRadius: 100,
              }}
            >
              {product.brand.name}
            </span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>
              {product.category.name}
            </span>
          </div>

          {/* Product name */}
          <div
            style={{
              fontSize: product.name.length > 60 ? 30 : product.name.length > 40 ? 36 : 42,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: 24,
              maxWidth: 540,
            }}
          >
            {product.name}
          </div>

          {/* Price */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#4da6e8",
              }}
            >
              {price}
            </span>
            {product.stock > 0 ? (
              <span
                style={{
                  background: "rgba(22,163,74,0.2)",
                  border: "1px solid rgba(22,163,74,0.4)",
                  color: "#4ade80",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 100,
                }}
              >
                In Stock
              </span>
            ) : (
              <span
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.4)",
                  color: "#f87171",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 100,
                }}
              >
                Out of Stock
              </span>
            )}
          </div>

          {/* Store badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: 20 }}>🛒</span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: 600 }}>
              QuickCart UAE
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>· quickcart.ae</span>
          </div>
        </div>

        {/* Right — product image */}
        {product.images[0] && (
          <div
            style={{
              width: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 48,
              background: "rgba(255,255,255,0.04)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                maxWidth: 320,
                maxHeight: 320,
                objectFit: "contain",
                borderRadius: 16,
              }}
            />
          </div>
        )}

        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 5,
            background: "linear-gradient(90deg, #ED1D32 0%, #0066BA 100%)",
          }}
        />
      </div>
    ),
    { ...size },
  )
}
