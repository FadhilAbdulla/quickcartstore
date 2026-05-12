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
  const settings = await db.settings.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json(map)
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const updates = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      db.settings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  )
  return NextResponse.json(updates)
}
