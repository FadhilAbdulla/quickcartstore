import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateOrderNumber } from "@/lib/utils"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const orders = await db.order.findMany({
      where: { userId: (session.user as any).id },
      include: { items: { include: { product: true } }, address: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { address, items, totalAmount, promoCodeId } = await req.json()

    if (!address || !items?.length) {
      return NextResponse.json({ error: "Address and items are required" }, { status: 400 })
    }

    const userId = (session.user as any).id

    const createdAddress = await db.address.create({
      data: { ...address, userId },
    })

    const order = await db.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressId: createdAddress.id,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    if (promoCodeId) {
      await db.promoCode.update({
        where: { id: promoCodeId },
        data: { usedCount: { increment: 1 } },
      }).catch(() => {})
    }

    return NextResponse.json(order, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
