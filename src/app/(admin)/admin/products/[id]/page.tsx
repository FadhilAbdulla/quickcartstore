import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, brands, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="text-gray-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        brands={brands}
        categories={categories}
        product={{
          ...product,
          price: Number(product.price),
          comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
          specs: (product.specs as Record<string, string>) || {},
        }}
      />
    </div>
  )
}
