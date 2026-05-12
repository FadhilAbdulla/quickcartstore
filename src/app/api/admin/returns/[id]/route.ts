import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") return null
  return session
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { id } = await params
    const { status, refundAmount, notes } = await req.json()

    const validStatuses = ["APPROVED", "REJECTED", "REFUNDED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const ret = await db.return.update({
      where: { id },
      data: { status, refundAmount: refundAmount || null, notes: notes || null },
    })

    return NextResponse.json(ret)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
