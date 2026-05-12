export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowRight, Shield, Truck, Headphones, Award, ChevronRight, Star, Zap, Battery, Cpu } from "lucide-react"
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

const brandColors: Record<string, string> = {
  apple: "from-gray-700 to-gray-900",
  dell: "from-blue-800 to-blue-950",
  lenovo: "from-red-800 to-red-950",
  hp: "from-indigo-800 to-indigo-950",
  asus: "from-teal-800 to-teal-950",
  microsoft: "from-cyan-800 to-cyan-950",
  samsung: "from-violet-800 to-violet-950",
  acer: "from-green-800 to-green-950",
  msi: "from-orange-800 to-orange-950",
}

const features = [
  { icon: Truck, title: "Free Delivery in UAE", desc: "Same-day delivery in Dubai, next-day across UAE", color: "text-blue-400" },
  { icon: Shield, title: "Authentic Products", desc: "All products are 100% genuine with UAE warranty", color: "text-green-400" },
  { icon: Headphones, title: "Expert Support", desc: "Technical experts available 7 days a week", color: "text-purple-400" },
  { icon: Award, title: "Best Price Guarantee", desc: "Found it cheaper? We'll match or beat the price", color: "text-yellow-400" },
]

export default async function HomePage() {
  const { products, brands, hasFeatured } = await getHomeData()

  return (
    <StoreLayoutWrapper>
      <div className="min-h-screen">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-[#0a0a0a]">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-purple-950/20" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="flex items-center gap-12 lg:gap-20">

              {/* Left — text */}
              <div className="flex-1 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-800/50 bg-blue-950/30 text-blue-400 text-xs font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  UAE&apos;s #1 Laptop Store — Free Delivery Today
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
                  Power Your
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Tomorrow.
                  </span>
                </h1>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Discover the UAE&apos;s widest selection of premium laptops. Authentic products, fast delivery to your door.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-12 px-7 text-base">
                    <Link href="/products">
                      Shop All Laptops <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-12 px-7 text-base">
                    <Link href="/products?featured=true">View Deals</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-[#1e1e1e]">
                  {[
                    { value: "500+", label: "Laptop Models" },
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

              {/* Right — visual mockup (desktop only) */}
              <div className="hidden lg:flex flex-1 items-center justify-center relative min-h-[420px]">
                {/* Glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 bg-blue-500/15 rounded-full blur-3xl" />
                </div>

                {/* Main product card */}
                <div className="relative z-10">
                  <div className="bg-[#111111]/95 border border-white/10 rounded-2xl p-5 w-60 shadow-2xl shadow-black/30">
                    {/* Fake laptop display */}
                    <div className="h-32 rounded-xl bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-white/5 mb-4 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/10" />
                      <div className="relative text-center">
                        <div className="text-3xl font-black text-white/10 select-none">M4</div>
                        <div className="text-[10px] text-blue-400/60 font-mono">Apple Silicon</div>
                      </div>
                      {/* screen reflection */}
                      <div className="absolute top-2 left-2 w-8 h-0.5 bg-white/5 rounded-full rotate-12" />
                    </div>
                    <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">Apple</div>
                    <div className="text-[#ffffff] text-sm font-semibold leading-snug mb-3">MacBook Pro 14&quot; M4 Pro</div>
                    <div className="flex gap-1 mb-3">
                      {["16GB", "512GB SSD", "M4 Pro"].map((spec) => (
                        <span key={spec} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#ffffff] font-bold text-base">AED 8,999</span>
                      <span className="text-[9px] px-2 py-1 rounded-full bg-green-600/20 text-green-400 border border-green-600/20">In Stock</span>
                    </div>
                  </div>

                  {/* Floating delivery badge */}
                  <div className="absolute -left-14 top-8 bg-green-600 rounded-xl px-3 py-2.5 shadow-lg shadow-green-900/40 animate-none">
                    <div className="flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-[#ffffff]" />
                      <div>
                        <p className="text-[#ffffff] text-[10px] font-semibold">Free Delivery</p>
                        <p className="text-green-200 text-[9px]">Same day in Dubai</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating rating badge */}
                  <div className="absolute -right-12 bottom-14 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      <div>
                        <p className="text-white text-[10px] font-bold">4.9 / 5</p>
                        <p className="text-gray-500 text-[9px]">50,000+ reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating spec badges */}
                  <div className="absolute -top-4 right-4 flex flex-col gap-2">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
                      <Cpu className="h-3 w-3 text-blue-400" />
                      <span className="text-[9px] text-white font-medium">Latest Chips</span>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
                      <Battery className="h-3 w-3 text-green-400" />
                      <span className="text-[9px] text-white font-medium">All-day battery</span>
                    </div>
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <span className="text-[9px] text-white font-medium">Fast performance</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Brands ── */}
        {brands.length > 0 && (
          <section className="py-12 border-y border-[#1a1a1a] bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white">Shop by Brand</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Authorized reseller for all major brands</p>
                </div>
                <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {brands.map((brand) => {
                  const key = brand.name.toLowerCase()
                  const gradient = brandColors[key] || "from-gray-700 to-gray-900"
                  return (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${brand.name.toLowerCase()}`}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${gradient} border border-white/5 hover:border-white/15 transition-all hover:-translate-y-0.5`}
                    >
                      <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-[#ffffff] font-bold text-base">{brand.name[0]}</span>
                      </div>
                      <span className="text-xs text-gray-300 group-hover:text-[#ffffff] font-medium transition-colors text-center leading-tight">
                        {brand.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Products ── */}
        {products.length > 0 && (
          <section className="py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {hasFeatured ? "Featured Laptops" : "Latest Laptops"}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {hasFeatured ? "Handpicked top-sellers for you" : "Browse our full collection"}
                  </p>
                </div>
                <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
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
                  <Link href="/products">Browse All Laptops <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ── Category Banners ── */}
        <section className="py-10 border-t border-[#1a1a1a]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Business Laptops", desc: "Performance meets portability", href: "/products?category=business", gradient: "from-blue-800 to-indigo-950", icon: "💼" },
                { title: "Gaming Laptops", desc: "Dominate every battlefield", href: "/products?category=gaming", gradient: "from-purple-800 to-red-950", icon: "🎮" },
                { title: "Student Laptops", desc: "Perfect for campus life", href: "/products?category=student", gradient: "from-emerald-800 to-teal-950", icon: "🎓" },
              ].map((cat) => (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className={`group flex flex-col justify-between p-6 rounded-xl bg-gradient-to-br ${cat.gradient} border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5 min-h-[160px]`}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h3 className="text-[#ffffff] font-semibold text-lg">{cat.title}</h3>
                    <p className="text-white/60 text-sm">{cat.desc}</p>
                    <div className="flex items-center gap-1 text-blue-300 text-sm mt-3">
                      Shop now <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-14 border-t border-[#1a1a1a] bg-[#080808]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4 p-5 rounded-xl border border-[#1a1a1a] bg-[#0f0f0f]">
                  <div className={`shrink-0 mt-0.5 ${feature.color}`}>
                    <feature.icon className="h-5 w-5" />
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
