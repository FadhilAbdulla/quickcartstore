import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return null
  return session
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { name, logo } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  try {
    const brand = await db.brand.update({
      where: { id },
      data: { name: name.trim(), logo: logo?.trim() || null },
    })
    return NextResponse.json(brand)
  } catch {
    return NextResponse.json({ error: "Brand name already exists" }, { status: 409 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const brand = await db.brand.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
  if (brand?._count.products) return NextResponse.json({ error: "Cannot delete brand with products" }, { status: 400 })
  await db.brand.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
