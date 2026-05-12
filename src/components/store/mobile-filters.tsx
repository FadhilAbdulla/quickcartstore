"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Brand { id: string; name: string }
interface Category { id: string; name: string; slug: string }

interface MobileFiltersProps {
  brands: Brand[]
  categories: Category[]
  currentBrand?: string
  currentCategory?: string
  currentMin?: string
  currentMax?: string
}

const priceRanges = [
  { label: "Under AED 3,000", min: "", max: "3000" },
  { label: "AED 3,000 – 6,000", min: "3000", max: "6000" },
  { label: "AED 6,000 – 10,000", min: "6000", max: "10000" },
  { label: "Above AED 10,000", min: "10000", max: "" },
]

export function MobileFilters({ brands, categories, currentBrand, currentCategory, currentMin, currentMax }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  const activeCount =
    (currentBrand ? 1 : 0) +
    (currentCategory ? 1 : 0) +
    (currentMin || currentMax ? 1 : 0)

  return (
    <>
      {/* Trigger button — mobile only */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden gap-2 h-9"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-blue-400" />
            Filters
          </h2>
          <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Brand */}
          <div>
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Brand</h3>
            <div className="space-y-1">
              <a
                href="/products"
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  !currentBrand ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                All Brands
              </a>
              {brands.map((brand) => (
                <a
                  key={brand.id}
                  href={`/products?brand=${brand.name.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentBrand?.toLowerCase() === brand.name.toLowerCase()
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  {brand.name}
                </a>
              ))}
            </div>
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Category</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentCategory === cat.slug
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
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Price Range</h3>
            <div className="space-y-1">
              {priceRanges.map((range) => {
                const isActive = currentMin === range.min && currentMax === range.max
                return (
                  <a
                    key={range.label}
                    href={`/products?${currentBrand ? `brand=${currentBrand}&` : ""}minPrice=${range.min}&maxPrice=${range.max}`}
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    {range.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e1e1e]">
          <a
            href="/products"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            Clear all filters
          </a>
        </div>
      </div>
    </>
  )
}
