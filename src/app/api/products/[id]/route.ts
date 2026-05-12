import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: { brand: true, category: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
