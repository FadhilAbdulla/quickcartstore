import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const blog = await db.blog.findUnique({ where: { slug, isPublished: true } })
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(blog)
}
