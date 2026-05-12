export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { CategoriesManager } from "@/components/admin/categories-manager"

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
      </div>
      <CategoriesManager initialCategories={categories} />
    </div>
  )
}
