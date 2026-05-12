import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { slugify } from "@/lib/utils"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { name, slug } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 })
  const finalSlug = slug?.trim() || slugify(name.trim())
  try {
    const category = await db.category.update({
      where: { id },
      data: { name: name.trim(), slug: finalSlug },
    })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Category name or slug already exists" }, { status: 409 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const cat = await db.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } })
  if (cat?._count.products) return NextResponse.json({ error: "Cannot delete category with products" }, { status: 400 })
  await db.category.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
