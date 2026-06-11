import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get("tag")
  const slug = searchParams.get("slug")
  const limit = parseInt(searchParams.get("limit") ?? "20", 10)

  const where: { isPublished: boolean; tags?: { has: string }; slug?: string } = { isPublished: true }
  if (tag) where.tags = { has: tag }
  if (slug) where.slug = slug

  const blogs = await db.blog.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      author: true,
      publishedAt: true,
    },
  })

  return NextResponse.json(blogs)
}
