export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { ProductCard } from "@/components/store/product-card"
import { ProductSortSelect } from "@/components/store/product-sort-select"
import { MobileFilters } from "@/components/store/mobile-filters"
import { SidebarFilters } from "@/components/store/sidebar-filters"

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

  const activeCategory = categories.find((c) => c.slug === params.category)
  const title = params.search
    ? `Results for "${params.search}"`
    : params.brand
    ? `${params.brand}`
    : params.featured
    ? "Deals & Featured"
    : activeCategory?.name ?? "All Products"

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-[116px]">
              <SidebarFilters
                brands={brands}
                categories={categories}
                currentBrand={params.brand}
                currentCategory={params.category}
                currentMin={params.minPrice}
                currentMax={params.maxPrice}
                currentSort={params.sort}
              />
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">
            {/* Compact header bar */}
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile filters trigger */}
                <MobileFilters
                  brands={brands}
                  categories={categories}
                  currentBrand={params.brand}
                  currentCategory={params.category}
                  currentMin={params.minPrice}
                  currentMax={params.maxPrice}
                />

                <div>
                  <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
                  <p className="text-gray-500 text-xs">{products.length} products</p>
                </div>

                {/* Active filter chips */}
                {params.brand && (
                  <a
                    href={`/products${params.category ? `?category=${params.category}` : ""}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/15 border border-blue-600/30 text-blue-400 text-xs hover:border-blue-500 transition-colors"
                  >
                    {params.brand} <span className="text-blue-300">×</span>
                  </a>
                )}
                {params.category && (
                  <a
                    href={`/products${params.brand ? `?brand=${params.brand}` : ""}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/15 border border-blue-600/30 text-blue-400 text-xs hover:border-blue-500 transition-colors"
                  >
                    {activeCategory?.name ?? params.category} <span className="text-blue-300">×</span>
                  </a>
                )}
                {(params.minPrice || params.maxPrice) && (
                  <a
                    href={`/products${params.brand ? `?brand=${params.brand}` : params.category ? `?category=${params.category}` : ""}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/15 border border-blue-600/30 text-blue-400 text-xs hover:border-blue-500 transition-colors"
                  >
                    AED {params.minPrice || "0"} – {params.maxPrice || "Any"} <span className="text-blue-300">×</span>
                  </a>
                )}
              </div>

              <ProductSortSelect currentSort={params.sort} />
            </div>

            {/* Product Grid */}
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-white text-xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <a href="/products" className="text-blue-400 hover:text-blue-300 text-sm">
                  Clear all filters
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
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
