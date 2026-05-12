import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { orderId, productId, reason, quantity } = await req.json()

    if (!orderId || !productId || !reason || !quantity) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const order = await db.order.findUnique({ where: { id: orderId } })
    if (!order || order.userId !== session.user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    if (order.status !== "DELIVERED") {
      return NextResponse.json({ error: "Returns are only accepted for delivered orders" }, { status: 400 })
    }

    const ret = await db.return.create({
      data: {
        orderId,
        userId: session.user.id,
        productId,
        reason,
        quantity,
      },
    })

    return NextResponse.json(ret, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
