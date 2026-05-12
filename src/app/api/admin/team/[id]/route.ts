import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  if (id === (session.user as any).id) {
    return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 })
  }
  await db.user.update({ where: { id }, data: { role: "CUSTOMER" } })
  return NextResponse.json({ success: true })
}
