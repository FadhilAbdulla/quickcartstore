export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { BrandsManager } from "@/components/admin/brands-manager"

export default async function AdminBrandsPage() {
  const brands = await db.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Brands</h1>
        <p className="text-gray-500 text-sm mt-1">{brands.length} brands</p>
      </div>
      <BrandsManager initialBrands={brands} />
    </div>
  )
}
