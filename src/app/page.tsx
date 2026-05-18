export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowRight, Shield, Truck, Headphones, Award, ChevronRight } from "lucide-react"
import { db } from "@/lib/db"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { StoreLayoutWrapper } from "@/components/store/store-layout-wrapper"

async function getHomeData() {
  const [featuredProducts, allBrands] = await Promise.all([
    db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { brand: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
  ])

  const displayProducts =
    featuredProducts.length >= 4
      ? featuredProducts
      : await db.product.findMany({
          where: { isActive: true },
          include: { brand: true, category: true },
          take: 8,
          orderBy: { createdAt: "desc" },
        })

  return { products: displayProducts, brands: allBrands, hasFeatured: featuredProducts.length >= 4 }
}

const CATEGORIES = [
  { name: "Laptops", slug: "laptops", icon: "💻", desc: "Business, gaming & ultrabooks", gradient: "from-blue-900/60 to-blue-950/80" },
  { name: "Gaming", slug: "gaming", icon: "🎮", desc: "Laptops, PCs & accessories", gradient: "from-red-900/60 to-purple-950/80" },
  { name: "Desktops", slug: "desktops", icon: "🖥️", desc: "Tower PCs & workstations", gradient: "from-slate-800/60 to-slate-900/80" },
  { name: "Monitors", slug: "monitors", icon: "🖵", desc: "4K, gaming & professional", gradient: "from-teal-900/60 to-teal-950/80" },
  { name: "PC Components", slug: "pc-components", icon: "⚙️", desc: "GPU, CPU, RAM & more", gradient: "from-violet-900/60 to-violet-950/80" },
  { name: "Networking", slug: "networking", icon: "📡", desc: "Routers, switches & APs", gradient: "from-orange-900/60 to-orange-950/80" },
  { name: "Storage", slug: "storage", icon: "💾", desc: "SSD, HDD & portable drives", gradient: "from-emerald-900/60 to-emerald-950/80" },
  { name: "Peripherals", slug: "peripherals", icon: "🖱️", desc: "Keyboards, mice & headsets", gradient: "from-cyan-900/60 to-cyan-950/80" },
  { name: "Printers", slug: "printers", icon: "🖨️", desc: "Laser, inkjet & MFP", gradient: "from-amber-900/60 to-amber-950/80" },
  { name: "Tablets", slug: "tablets", icon: "📱", desc: "Android, Windows & more", gradient: "from-pink-900/60 to-pink-950/80" },
]

const features = [
  { icon: Truck, title: "Free Delivery in UAE", desc: "Same-day delivery in Dubai, next-day across UAE", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Shield, title: "Authentic Products", desc: "100% genuine with UAE warranty on all items", color: "text-green-400", bg: "bg-green-400/10" },
  { icon: Headphones, title: "Expert Support", desc: "Technical experts available 7 days a week", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: Award, title: "Best Price Guarantee", desc: "Found it cheaper? We'll match or beat the price", color: "text-yellow-400", bg: "bg-yellow-400/10" },
]

export default async function HomePage() {
  const { products, brands, hasFeatured } = await getHomeData()

  return (
    <StoreLayoutWrapper>
      <div className="min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-transparent to-purple-950/20" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`, backgroundSize: "40px 40px" }}
          />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-950/40 text-blue-400 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                UAE&apos;s #1 IT Store — Free Delivery Today
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
                Your One-Stop
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  IT Store.
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
                Laptops, gaming rigs, monitors, networking, components and more — all authentic, all delivered fast across the UAE.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 px-7 text-base">
                  <Link href="/products">
                    Shop All Products <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base">
                  <Link href="/products?featured=true">🏷️ View Deals</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-[#1e1e1e]">
                {[
                  { value: "5000+", label: "IT Products" },
                  { value: "50K+", label: "Happy Customers" },
                  { value: "24h", label: "UAE Delivery" },
                  { value: "2 Yr", label: "Warranty" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Shop by Category ── */}
        <section className="py-14 border-t border-[#1a1a1a]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Shop by Category</h2>
                <p className="text-gray-500 text-sm mt-1">Everything your business and home needs</p>
              </div>
              <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 shrink-0">
                All products <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className={`group relative flex flex-col gap-3 p-4 rounded-xl bg-gradient-to-br ${cat.gradient} border border-white/5 hover:border-white/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 overflow-hidden`}
                >
                  <span className="text-3xl leading-none">{cat.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
                    <p className="text-white/50 text-[11px] mt-0.5 leading-tight">{cat.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-blue-300/80 text-[11px] font-medium group-hover:text-blue-300 transition-colors">
                    Shop now <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/3 rounded-full -translate-x-2 translate-y-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        {products.length > 0 && (
          <section className="py-14 border-t border-[#1a1a1a] bg-[#080808]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {hasFeatured ? "⭐ Featured Products" : "Latest Products"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {hasFeatured ? "Handpicked bestsellers across all categories" : "Fresh arrivals in our store"}
                  </p>
                </div>
                <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 shrink-0">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <div className="text-center mt-10">
                <Button asChild variant="outline" size="lg">
                  <Link href="/products">Browse All Products <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ── Brands — horizontal scroll strip ── */}
        {brands.length > 0 && (
          <section className="py-10 border-t border-[#1a1a1a]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Top Brands</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Authorized reseller for all major brands</p>
                </div>
                <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1 shrink-0">
                  All brands <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {/* Scrollable pill row */}
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/products?brand=${brand.name.toLowerCase()}`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#111111] hover:border-blue-500/40 hover:bg-[#1a1a1a] transition-all group"
                  >
                    <div className="h-5 w-5 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
                      <span className="text-blue-400 font-bold text-[10px]">{brand.name[0]}</span>
                    </div>
                    <span className="text-gray-400 group-hover:text-white text-sm whitespace-nowrap font-medium transition-colors">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Features / Trust Signals ── */}
        <section className="py-14 border-t border-[#1a1a1a] bg-[#080808]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 p-5 rounded-xl border border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#2a2a2a] transition-colors">
                  <div className={`shrink-0 h-9 w-9 rounded-lg ${feature.bg} flex items-center justify-center`}>
                    <feature.icon className={`h-4.5 w-4.5 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </StoreLayoutWrapper>
  )
}
