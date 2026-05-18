import { db } from "@/lib/db"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to add a new product</p>
      </div>
      <ProductForm brands={brands} categories={categories} />
    </div>
  )
}
