import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const brands = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(brands)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name, logo } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  try {
    const brand = await db.brand.create({ data: { name: name.trim(), logo: logo?.trim() || null } })
    return NextResponse.json(brand, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Brand name already exists" }, { status: 409 })
  }
}
