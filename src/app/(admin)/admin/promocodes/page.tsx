export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { PromoCodesManager } from "@/components/admin/promocodes-manager"

export default async function PromoCodesPage() {
  const promoCodes = await db.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Promo Codes</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage discount codes for customers</p>
      </div>
      <PromoCodesManager initialCodes={promoCodes.map((c) => ({ ...c, discountValue: Number(c.discountValue), minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null }))} />
    </div>
  )
}
