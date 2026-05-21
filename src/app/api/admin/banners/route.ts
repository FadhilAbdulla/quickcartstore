import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function GET() {
  const banners = await db.banner.findMany({ orderBy: { sortOrder: "asc" } })
  return NextResponse.json(banners)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json()
  const banner = await db.banner.create({
    data: {
      title: body.title,
      subtitle: body.subtitle ?? null,
      ctaText: body.ctaText ?? null,
      ctaLink: body.ctaLink ?? null,
      image: body.image ?? null,
      bgFrom: body.bgFrom ?? "#072654",
      bgTo: body.bgTo ?? "#0a3d7a",
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  })
  return NextResponse.json(banner, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const banner = await db.banner.update({ where: { id }, data })
  return NextResponse.json(banner)
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await db.banner.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
