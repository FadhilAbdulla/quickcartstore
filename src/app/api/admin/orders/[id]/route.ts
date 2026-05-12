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
    const { status } = await req.json()

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const order = await db.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
