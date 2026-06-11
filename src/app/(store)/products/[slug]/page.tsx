export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductDetailClient } from "./product-detail-client"
import type { Metadata } from "next"
import { SITE, breadcrumbJsonLd } from "@/lib/seo"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true, category: true },
  })
  if (!product) return { title: "Product Not Found" }

  const price = Number(product.price)
  const title = `${product.name} — Buy in UAE | QuickCart`
  const description = `${product.description.slice(0, 155)}…`

  return {
    title,
    description,
    keywords: [
      product.name,
      product.brand.name,
      product.category.name,
      `${product.name} price UAE`,
      `buy ${product.brand.name} Dubai`,
      `${product.name} Dubai`,
    ],
    alternates: { canonical: `${SITE.url}/products/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
      locale: "en_AE",
      siteName: "QuickCart UAE",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0] ? [product.images[0]] : [],
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "AED",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: { brand: true, category: true },
  })

  if (!product) notFound()

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: { brand: true, category: true },
    take: 4,
  })

  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand.name,
    },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `https://www.quickcartstore.ae/products/${product.slug}`,
      priceCurrency: "AED",
      price: price.toFixed(2),
      ...(comparePrice ? { highPrice: comparePrice.toFixed(2) } : {}),
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "QuickCart UAE",
        url: "https://www.quickcartstore.ae",
      },
      areaServed: {
        "@type": "Country",
        name: "United Arab Emirates",
      },
    },
    ...(Object.keys(product.specs as object).length > 0 ? {
      additionalProperty: Object.entries(product.specs as Record<string, string>).map(([name, value]) => ({
        "@type": "PropertyValue",
        name,
        value,
      })),
    } : {}),
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Products", url: `${SITE.url}/products` },
    { name: product.category.name, url: `${SITE.url}/products?category=${product.category.slug}` },
    { name: product.name, url: `${SITE.url}/products/${product.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ProductDetailClient
        product={{
          ...product,
          price,
          comparePrice,
          specs: product.specs as Record<string, string>,
        }}
        related={related.map((r) => ({
          ...r,
          price: Number(r.price),
          comparePrice: r.comparePrice ? Number(r.comparePrice) : null,
        }))}
      />
    </>
  )
}
