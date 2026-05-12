export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Plus, Pencil, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; brand?: string }>
}) {
  const params = await searchParams
  const where: any = {}
  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { sku: { contains: params.search, mode: "insensitive" } },
    ]
  }
  if (params.brand) {
    where.brand = { name: { equals: params.brand, mode: "insensitive" } }
  }

  const [products, brands] = await Promise.all([
    db.product.findMany({
      where,
      include: { brand: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <form className="flex gap-3 mb-6">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Search by name or SKU..."
          className="flex-1 h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="brand"
          defaultValue={params.brand || ""}
          className="h-10 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-3 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="default">
          Filter
        </Button>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                <th className="text-left text-gray-500 font-medium px-5 py-3">Product</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Brand</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Category</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Price</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Stock</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                <th className="text-right text-gray-500 font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Package className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No products found</p>
                    <Link href="/admin/products/new" className="text-blue-400 text-sm mt-2 inline-block">
                      Add your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0f0f0f] flex items-center justify-center shrink-0">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-contain p-1 rounded-lg"
                            />
                          ) : (
                            <Package className="h-4 w-4 text-gray-700" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium truncate max-w-[200px]">{product.name}</p>
                          <p className="text-gray-500 text-xs">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{product.brand.name}</td>
                    <td className="px-4 py-3 text-gray-400">{product.category.name}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white">{formatPrice(Number(product.price))}</p>
                        {product.comparePrice && (
                          <p className="text-gray-500 text-xs line-through">
                            {formatPrice(Number(product.comparePrice))}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 5
                            ? "text-yellow-400"
                            : "text-green-400"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.isActive ? "success" : "outline"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
