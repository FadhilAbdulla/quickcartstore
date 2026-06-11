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
  const denied = await requireAdmin()
  if (denied) return denied

  const blogs = await db.blog.findMany({ orderBy: { publishedAt: "desc" } })
  return NextResponse.json(blogs)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json()
  const blog = await db.blog.create({
    data: {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage ?? null,
      tags: body.tags ?? [],
      author: body.author ?? "QuickCart Team",
      isPublished: body.isPublished ?? true,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
    },
  })
  return NextResponse.json(blog, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const blog = await db.blog.update({ where: { id }, data })
  return NextResponse.json(blog)
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await db.blog.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
