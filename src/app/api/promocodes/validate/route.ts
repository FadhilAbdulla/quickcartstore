import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { code, orderAmount } = await req.json()
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 })

  const promo = await db.promoCode.findUnique({ where: { code: code.trim().toUpperCase() } })

  if (!promo || !promo.isActive) {
    return NextResponse.json({ error: "Invalid or inactive promo code" }, { status: 404 })
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return NextResponse.json({ error: "This promo code has expired" }, { status: 400 })
  }
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
    return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 })
  }
  if (promo.minOrderAmount !== null && orderAmount < Number(promo.minOrderAmount)) {
    return NextResponse.json(
      { error: `Minimum order of AED ${Number(promo.minOrderAmount).toFixed(0)} required` },
      { status: 400 }
    )
  }

  const discount =
    promo.discountType === "PERCENTAGE"
      ? (orderAmount * Number(promo.discountValue)) / 100
      : Math.min(Number(promo.discountValue), orderAmount)

  return NextResponse.json({
    id: promo.id,
    code: promo.code,
    discountType: promo.discountType,
    discountValue: Number(promo.discountValue),
    discount: parseFloat(discount.toFixed(2)),
  })
}
