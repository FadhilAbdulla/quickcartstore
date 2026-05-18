import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const settings = await db.settings.findMany({
    where: { key: { in: ["vatRate", "processingRate", "currency", "shippingFee"] } },
  })
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json({
    vatRate: parseFloat(map.vatRate ?? "5"),
    processingRate: parseFloat(map.processingRate ?? "0"),
    currency: map.currency ?? "AED",
    shippingFee: parseFloat(map.shippingFee ?? "0"),
  })
}
