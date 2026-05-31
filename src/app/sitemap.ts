import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

const BASE = "https://quickcart.ae"


const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE, changeFrequency: "daily", priority: 1.0 },
  { url: `${BASE}/products`, changeFrequency: "daily", priority: 0.9 },
  { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/support/faq`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE}/support/contact`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/support/return-policy`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/support/shipping-policy`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE}/support/warranty`, changeFrequency: "monthly", priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
