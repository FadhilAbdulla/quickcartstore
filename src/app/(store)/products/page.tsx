export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { ProductCard } from "@/components/store/product-card"
import { ProductSortSelect } from "@/components/store/product-sort-select"
import { MobileFilters } from "@/components/store/mobile-filters"
import { SlidersHorizontal } from "lucide-react"

interface SearchParams {
  brand?: string
  category?: string
  search?: string
  featured?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
}

async function getProducts(params: SearchParams) {
  const where: any = { isActive: true }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ]
  }
  if (params.brand) {
    where.brand = { name: { equals: params.brand, mode: "insensitive" } }
  }
  if (params.category) {
    where.category = { slug: params.category }
  }
  if (params.featured === "true") {
    where.isFeatured = true
  }
  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) where.price.gte = Number(params.minPrice)
    if (params.maxPrice) where.price.lte = Number(params.maxPrice)
  }

  const orderBy: any =
    params.sort === "price-asc"
      ? { price: "asc" }
      : params.sort === "price-desc"
      ? { price: "desc" }
      : params.sort === "newest"
      ? { createdAt: "desc" }
      : { isFeatured: "desc" }

  return db.product.findMany({
    where,
    include: { brand: true, category: true },
    orderBy,
  })
}

async function getFilterData() {
  const [brands, categories] = await Promise.all([
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ])
  return { brands, categories }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [products, { brands, categories }] = await Promise.all([
    getProducts(params),
    getFilterData(),
  ])

  const title = params.search
    ? `Search: "${params.search}"`
    : params.brand
    ? `${params.brand} Laptops`
    : params.category
    ? `${params.category} Laptops`
    : params.featured
    ? "Featured Laptops"
    : "All Laptops"

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                  Filters
                </h3>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Brand</h4>
                <div className="space-y-1">
                  <a
                    href="/products"
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      !params.brand ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    All Brands
                  </a>
                  {brands.map((brand) => (
                    <a
                      key={brand.id}
                      href={`/products?brand=${brand.name.toLowerCase()}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        params.brand?.toLowerCase() === brand.name.toLowerCase()
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                      }`}
                    >
                      {brand.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Category</h4>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          params.category === cat.slug
                            ? "bg-blue-600/20 text-blue-400"
                            : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                        }`}
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h4 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">Price Range</h4>
                <div className="space-y-1">
                  {[
                    { label: "Under AED 3,000", min: "", max: "3000" },
                    { label: "AED 3,000 - 6,000", min: "3000", max: "6000" },
                    { label: "AED 6,000 - 10,000", min: "6000", max: "10000" },
                    { label: "Above AED 10,000", min: "10000", max: "" },
                  ].map((range) => (
                    <a
                      key={range.label}
                      href={`/products?${params.brand ? `brand=${params.brand}&` : ""}minPrice=${range.min}&maxPrice=${range.max}`}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    >
                      {range.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1a1a1a]">
              <div className="flex flex-wrap items-center gap-2">
                {/* Mobile filters trigger */}
                <MobileFilters
                  brands={brands}
                  categories={categories}
                  currentBrand={params.brand}
                  currentCategory={params.category}
                  currentMin={params.minPrice}
                  currentMax={params.maxPrice}
                />
                {params.brand && (
                  <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs">
                    Brand: {params.brand}
                    <a href="/products" className="ml-2 hover:text-white">×</a>
                  </span>
                )}
                {params.category && (
                  <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs">
                    Category: {params.category}
                    <a href="/products" className="ml-2 hover:text-white">×</a>
                  </span>
                )}
              </div>
              <ProductSortSelect currentSort={params.sort} />
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <a
                  href="/products"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear all filters
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: Number(product.price),
                      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
