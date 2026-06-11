import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/account",
          "/orders",
          "/cart",
          "/checkout",
          "/returns",
          "/auth",
          "/api",
        ],
      },
    ],
    sitemap: "https://www.quickcartstore.ae/sitemap.xml",
    host: "https://www.quickcartstore.ae",
  }
}
