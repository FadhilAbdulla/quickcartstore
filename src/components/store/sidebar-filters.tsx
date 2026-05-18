"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"

interface Brand { id: string; name: string }
interface Category { id: string; name: string; slug: string }

interface SidebarFiltersProps {
  brands: Brand[]
  categories: Category[]
  currentBrand?: string
  currentCategory?: string
  currentMin?: string
  currentMax?: string
  currentSort?: string
}

const PRICE_MIN = 0
const PRICE_MAX = 15000

function AccordionSection({
  title,
  defaultOpen = true,
  badge,
  children,
}: {
  title: string
  defaultOpen?: boolean
  badge?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-xs font-semibold uppercase tracking-widest group-hover:text-white transition-colors">
            {title}
          </span>
          {badge && (
            <span className="h-4 px-1.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center">
              {badge}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-gray-600 shrink-0" />
          : <ChevronDown className="h-3.5 w-3.5 text-gray-600 shrink-0" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

function DualSlider({
  min, max, step, valueMin, valueMax,
  onChangeMin, onChangeMax,
}: {
  min: number; max: number; step: number
  valueMin: number; valueMax: number
  onChangeMin: (v: number) => void
  onChangeMax: (v: number) => void
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div className="relative h-8 flex items-center">
      {/* Track background */}
      <div className="absolute left-0 right-0 h-1.5 bg-[#2a2a2a] rounded-full" />
      {/* Active fill */}
      <div
        className="absolute h-1.5 bg-blue-600 rounded-full pointer-events-none"
        style={{ left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }}
      />
      {/* Min input (invisible, full-width) */}
      <input
        type="range"
        min={min} max={max} step={step}
        value={valueMin}
        onChange={(e) => onChangeMin(Math.min(Number(e.target.value), valueMax - step))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: valueMin > max - (max - min) * 0.1 ? 5 : 3 }}
      />
      {/* Max input (invisible, full-width) */}
      <input
        type="range"
        min={min} max={max} step={step}
        value={valueMax}
        onChange={(e) => onChangeMax(Math.max(Number(e.target.value), valueMin + step))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        style={{ zIndex: 4 }}
      />
      {/* Visual min thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-md pointer-events-none z-10"
        style={{ left: `calc(${pct(valueMin)}% - 8px)` }}
      />
      {/* Visual max thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-md pointer-events-none z-10"
        style={{ left: `calc(${pct(valueMax)}% - 8px)` }}
      />
    </div>
  )
}

export function SidebarFilters({
  brands,
  categories,
  currentBrand,
  currentCategory,
  currentMin,
  currentMax,
  currentSort,
}: SidebarFiltersProps) {
  const router = useRouter()
  const [priceMin, setPriceMin] = useState(currentMin ? Number(currentMin) : PRICE_MIN)
  const [priceMax, setPriceMax] = useState(currentMax ? Number(currentMax) : PRICE_MAX)

  const hasFilters = !!(currentBrand || currentCategory || currentMin || currentMax)

  const buildHref = (overrides: Record<string, string | undefined | null>) => {
    const p = new URLSearchParams()
    const merged = {
      brand: currentBrand,
      category: currentCategory,
      minPrice: currentMin,
      maxPrice: currentMax,
      sort: currentSort,
      ...overrides,
    }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    const s = p.toString()
    return `/products${s ? `?${s}` : ""}`
  }

  const applyPrice = () => {
    const p = new URLSearchParams()
    if (currentBrand) p.set("brand", currentBrand)
    if (currentCategory) p.set("category", currentCategory)
    if (currentSort) p.set("sort", currentSort)
    if (priceMin > PRICE_MIN) p.set("minPrice", String(priceMin))
    if (priceMax < PRICE_MAX) p.set("maxPrice", String(priceMax))
    router.push(`/products?${p.toString()}`)
  }

  return (
    <div className="space-y-0 divide-y divide-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-blue-400" />
          Filters
        </h3>
        {hasFilters && (
          <a
            href="/products"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="h-3 w-3" /> Clear all
          </a>
        )}
      </div>

      {/* Category */}
      <AccordionSection title="Category" defaultOpen badge={currentCategory ? "1" : undefined}>
        <div className="space-y-0.5 mt-1">
          <a
            href="/products"
            className={`flex items-center px-2 py-1.5 rounded-lg text-sm transition-colors ${
              !currentCategory ? "bg-blue-600/15 text-blue-400 font-medium" : "text-gray-200 hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            All Categories
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={buildHref({ category: cat.slug, brand: currentBrand })}
              className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-blue-600/15 text-blue-400 font-medium"
                  : "text-gray-200 hover:text-white hover:bg-[#1a1a1a]"
              }`}
            >
              <span>{cat.name}</span>
              {currentCategory === cat.slug && <X className="h-3 w-3" />}
            </a>
          ))}
        </div>
      </AccordionSection>

      {/* Brand */}
      <AccordionSection
        title="Brand"
        defaultOpen={!!currentBrand}
        badge={currentBrand ? "1" : undefined}
      >
        <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a2a transparent" }}>
          <a
            href={buildHref({ brand: null })}
            className={`flex items-center px-2 py-1.5 rounded-lg text-sm transition-colors ${
              !currentBrand ? "bg-blue-600/15 text-blue-400 font-medium" : "text-gray-200 hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            All Brands
          </a>
          {brands.map((brand) => {
            const active = currentBrand?.toLowerCase() === brand.name.toLowerCase()
            return (
              <a
                key={brand.id}
                href={buildHref({ brand: brand.name.toLowerCase() })}
                className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-blue-600/15 text-blue-400 font-medium" : "text-gray-200 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <span>{brand.name}</span>
                {active && <X className="h-3 w-3" />}
              </a>
            )
          })}
        </div>
      </AccordionSection>

      {/* Price Range with Dual Slider */}
      <AccordionSection
        title="Price Range (AED)"
        defaultOpen={!!(currentMin || currentMax)}
        badge={currentMin || currentMax ? "1" : undefined}
      >
        <div className="mt-3 px-1">
          {/* Current values */}
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Min</p>
              <p className="text-white text-sm font-semibold">
                AED {priceMin.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-0.5">Max</p>
              <p className="text-white text-sm font-semibold">
                {priceMax >= PRICE_MAX ? "Any" : `AED ${priceMax.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Dual slider */}
          <DualSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={100}
            valueMin={priceMin}
            valueMax={priceMax}
            onChangeMin={setPriceMin}
            onChangeMax={setPriceMax}
          />

          {/* Apply button */}
          <button
            onClick={applyPrice}
            className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Apply Price Filter
          </button>

          {/* Quick presets */}
          <div className="mt-2 grid grid-cols-2 gap-1">
            {[
              { label: "Under 3K", min: 0, max: 3000 },
              { label: "3K – 6K", min: 3000, max: 6000 },
              { label: "6K – 10K", min: 6000, max: 10000 },
              { label: "10K+", min: 10000, max: 15000 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setPriceMin(preset.min); setPriceMax(preset.max) }}
                className="py-1.5 px-2 rounded-lg text-xs text-gray-200 hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#1a1a1a] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* Availability */}
      <AccordionSection title="Offers" defaultOpen={false}>
        <div className="space-y-0.5 mt-1">
          <a
            href={buildHref({ featured: "true" } as any)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <span>⭐</span> Featured Products
          </a>
          <a
            href={buildHref({})}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-gray-200 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
            In Stock Only
          </a>
        </div>
      </AccordionSection>
    </div>
  )
}
