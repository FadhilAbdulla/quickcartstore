import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const codes = await db.promoCode.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(codes)
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = await req.json()
  if (!code?.trim() || !discountType || !discountValue) {
    return NextResponse.json({ error: "Code, type and value are required" }, { status: 400 })
  }
  if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
    return NextResponse.json({ error: "discountType must be PERCENTAGE or FIXED" }, { status: 400 })
  }
  if (discountType === "PERCENTAGE" && (discountValue < 1 || discountValue > 100)) {
    return NextResponse.json({ error: "Percentage must be between 1 and 100" }, { status: 400 })
  }
  try {
    const promo = await db.promoCode.create({
      data: {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    })
    return NextResponse.json(promo, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Promo code already exists" }, { status: 409 })
  }
}
