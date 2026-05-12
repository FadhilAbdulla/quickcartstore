export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductDetailClient } from "./product-detail-client"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true },
  })
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.description,
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
      brandId: product.brandId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: { brand: true },
    take: 4,
  })

  return (
    <ProductDetailClient
      product={{
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        specs: product.specs as Record<string, string>,
      }}
      related={related.map((r) => ({
        ...r,
        price: Number(r.price),
        comparePrice: r.comparePrice ? Number(r.comparePrice) : null,
      }))}
    />
  )
}
