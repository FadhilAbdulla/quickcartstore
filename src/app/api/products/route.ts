import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const where: any = { isActive: true }

    const search = searchParams.get("search")
    const brand = searchParams.get("brand")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }
    if (brand) {
      where.brand = { name: { equals: brand, mode: "insensitive" } }
    }
    if (category) {
      where.category = { slug: category }
    }
    if (featured === "true") {
      where.isFeatured = true
    }

    const products = await db.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { isFeatured: "desc" },
    })

    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
