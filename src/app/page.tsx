export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowRight, Shield, Truck, Headphones, Award, ChevronRight } from "lucide-react"
import { db } from "@/lib/db"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { StoreLayoutWrapper } from "@/components/store/store-layout-wrapper"
import { HeroBanner } from "@/components/store/hero-banner"

async function getHomeData() {
  const [featuredProducts, allBrands, banners] = await Promise.all([
    db.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { brand: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    db.brand.findMany({ orderBy: { name: "asc" } }),
    db.banner.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
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

  return { products: displayProducts, brands: allBrands, hasFeatured: featuredProducts.length >= 4, banners }
}

const CATEGORIES = [
  { name: "Laptops", slug: "laptops", icon: "💻", desc: "Business, gaming & ultrabooks", color: "#0066BA" },
  { name: "Gaming", slug: "gaming", icon: "🎮", desc: "Laptops, PCs & accessories", color: "#0a3d7a" },
  { name: "Desktops", slug: "desktops", icon: "🖥️", desc: "Tower PCs & workstations", color: "#072654" },
  { name: "Monitors", slug: "monitors", icon: "🖵", desc: "4K, gaming & professional", color: "#0055a0" },
  { name: "PC Components", slug: "pc-components", icon: "⚙️", desc: "GPU, CPU, RAM & more", color: "#004e8c" },
  { name: "Networking", slug: "networking", icon: "📡", desc: "Routers, switches & APs", color: "#0a3d7a" },
  { name: "Storage", slug: "storage", icon: "💾", desc: "SSD, HDD & portable drives", color: "#0066BA" },
  { name: "Peripherals", slug: "peripherals", icon: "🖱️", desc: "Keyboards, mice & headsets", color: "#005aa5" },
  { name: "Printers", slug: "printers", icon: "🖨️", desc: "Laser, inkjet & MFP", color: "#0a3d7a" },
  { name: "Tablets", slug: "tablets", icon: "📱", desc: "Android, Windows & more", color: "#072654" },
]

const features = [
  { icon: Truck, title: "Free Delivery in UAE", desc: "Same-day delivery in Dubai, next-day across UAE", color: "#0066BA", bg: "rgba(0,102,186,0.08)" },
  { icon: Shield, title: "Authentic Products", desc: "100% genuine with UAE warranty on all items", color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
  { icon: Headphones, title: "Expert Support", desc: "Technical experts available 7 days a week", color: "#7c3aed", bg: "rgba(124,58,237,0.08)" },
  { icon: Award, title: "Best Price Guarantee", desc: "Found it cheaper? We'll match or beat the price", color: "#b45309", bg: "rgba(180,83,9,0.08)" },
]

export default async function HomePage() {
  const { products, brands, hasFeatured, banners } = await getHomeData()

  return (
    <StoreLayoutWrapper>
      <div className="min-h-screen">

        {/* ── Hero Banner Carousel ── */}
        {banners.length > 0 ? (
          <HeroBanner banners={banners} />
        ) : (
          /* Fallback static hero when no banners configured */
          <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #072654 0%, #0a3d7a 100%)" }}>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`, backgroundSize: "40px 40px" }}
            />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#0066BA" }} />

            <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-14 md:py-24">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 text-blue-100 text-xs font-medium mb-4 md:mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-200" />
                  </span>
                  UAE&apos;s #1 IT Store — Free Delivery Today
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-3 md:mb-5">
                  Your One-Stop<br />
                  <span style={{ color: "#4da6e8" }}>IT Store.</span>
                </h1>
                <p className="text-blue-200 text-sm sm:text-base md:text-lg leading-relaxed mb-5 md:mb-8 max-w-xl">
                  Laptops, gaming rigs, monitors, networking, components and more — all authentic, all delivered fast across the UAE.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-12 px-7 text-base text-white" style={{ backgroundColor: "#0066BA" }}>
                    <Link href="/products">Shop All Products <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base text-white border-white/30 hover:bg-white/10">
                    <Link href="/products?featured=true">🏷️ View Deals</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-5 sm:gap-8 mt-6 md:mt-10 pt-6 md:pt-8 border-t border-white/10">
                  {[
                    { value: "5000+", label: "IT Products" },
                    { value: "50K+", label: "Happy Customers" },
                    { value: "24h", label: "UAE Delivery" },
                    { value: "2 Yr", label: "Warranty" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-blue-300 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Shop by Category ── */}
        <section className="py-8 sm:py-14 border-t border-[#dde6f0] bg-[#f5f7fb]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-5 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#072654" }}>Shop by Category</h2>
                <p className="text-gray-500 text-sm mt-1">Everything your business and home needs</p>
              </div>
              <Link href="/products" className="text-sm hover:opacity-80 flex items-center gap-1 shrink-0" style={{ color: "#0066BA" }}>
                All products <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col gap-3 p-4 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${cat.color} 0%, #072654 100%)` }}
                >
                  <span className="text-3xl leading-none">{cat.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm leading-tight">{cat.name}</p>
                    <p className="text-white/60 text-[11px] mt-0.5 leading-tight">{cat.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-blue-200 text-[11px] font-medium group-hover:text-white transition-colors">
                    Shop now <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-x-2 translate-y-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        {products.length > 0 && (
          <section className="py-14 border-t border-[#dde6f0] bg-white">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "#072654" }}>
                    {hasFeatured ? "⭐ Featured Products" : "Latest Products"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {hasFeatured ? "Handpicked bestsellers across all categories" : "Fresh arrivals in our store"}
                  </p>
                </div>
                <Link href="/products" className="text-sm hover:opacity-80 flex items-center gap-1 shrink-0" style={{ color: "#0066BA" }}>
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
                <Button asChild variant="outline" size="lg" style={{ borderColor: "#0066BA", color: "#0066BA" }}>
                  <Link href="/products">Browse All Products <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ── Brands ── */}
        {brands.length > 0 && (
          <section className="py-10 border-t border-[#dde6f0] bg-[#f5f7fb]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#072654" }}>Top Brands</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Authorized reseller for all major brands</p>
                </div>
                <Link href="/products" className="text-sm hover:opacity-80 flex items-center gap-1 shrink-0" style={{ color: "#0066BA" }}>
                  All brands <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/products?brand=${brand.name.toLowerCase()}`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-[#dde6f0] bg-white hover:border-[#0066BA]/40 hover:bg-[#eef3fa] transition-all group"
                  >
                    <div
                      className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "rgba(0,102,186,0.1)", border: "1px solid rgba(0,102,186,0.2)" }}
                    >
                      <span className="font-bold text-[10px]" style={{ color: "#0066BA" }}>{brand.name[0]}</span>
                    </div>
                    <span className="text-gray-600 group-hover:text-[#072654] text-sm whitespace-nowrap font-medium transition-colors">
                      {brand.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Trust Signals ── */}
        <section className="py-14 border-t border-[#dde6f0] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 p-5 rounded-xl border border-[#dde6f0] bg-[#f5f7fb] hover:border-[#c8d8ea] hover:shadow-sm transition-all">
                  <div className="shrink-0 h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: feature.bg }}>
                    <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: "#072654" }}>{feature.title}</h3>
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
