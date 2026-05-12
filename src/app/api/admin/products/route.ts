import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return null
  }
  return session
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const { name, slug, description, price, comparePrice, brandId, categoryId, specs, stock, sku, isActive, isFeatured, images } = body

    if (!name || !slug || !price || !brandId || !categoryId || !sku) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await db.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    })
    if (existing) {
      return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 409 })
    }

    const product = await db.product.create({
      data: {
        name, slug, description, price, comparePrice, brandId, categoryId,
        specs: specs || {}, stock, sku, isActive, isFeatured,
        images: images || [],
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "SKU or slug already in use" }, { status: 409 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
