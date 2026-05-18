"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubItem { label: string; href: string; bold?: boolean }
interface BrandItem { name: string; href: string }

const CATEGORY_NAV = [
  {
    name: "Laptops", slug: "laptops", icon: "💻",
    types: [
      { label: "Business Laptops", href: "/products?category=laptops" },
      { label: "Student & Home", href: "/products?category=laptops&brand=acer" },
      { label: "Premium Ultrabooks", href: "/products?category=laptops&brand=apple" },
      { label: "Microsoft Surface", href: "/products?category=laptops&brand=microsoft" },
      { label: "View All Laptops →", href: "/products?category=laptops", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Apple", href: "/products?category=laptops&brand=apple" },
      { name: "Dell", href: "/products?category=laptops&brand=dell" },
      { name: "HP", href: "/products?category=laptops&brand=hp" },
      { name: "Lenovo", href: "/products?category=laptops&brand=lenovo" },
      { name: "ASUS", href: "/products?category=laptops&brand=asus" },
      { name: "Acer", href: "/products?category=laptops&brand=acer" },
    ] as BrandItem[],
  },
  {
    name: "Gaming", slug: "gaming", icon: "🎮",
    types: [
      { label: "High-End Gaming", href: "/products?category=gaming&brand=asus" },
      { label: "Mid-Range Gaming", href: "/products?category=gaming&brand=acer" },
      { label: "Budget Gaming", href: "/products?category=gaming&brand=lenovo" },
      { label: "Slim Gaming", href: "/products?category=gaming&brand=hp" },
      { label: "View All Gaming →", href: "/products?category=gaming", bold: true },
    ] as SubItem[],
    brands: [
      { name: "ASUS ROG", href: "/products?category=gaming&brand=asus" },
      { name: "Acer Predator", href: "/products?category=gaming&brand=acer" },
      { name: "HP OMEN", href: "/products?category=gaming&brand=hp" },
      { name: "Lenovo LOQ", href: "/products?category=gaming&brand=lenovo" },
      { name: "MSI", href: "/products?category=gaming&brand=msi" },
    ] as BrandItem[],
  },
  {
    name: "Desktops", slug: "desktops", icon: "🖥️",
    types: [
      { label: "Tower PCs", href: "/products?category=desktops" },
      { label: "Mini PCs", href: "/products?category=desktops&brand=apple" },
      { label: "Workstations", href: "/products?category=desktops&brand=dell" },
      { label: "View All Desktops →", href: "/products?category=desktops", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Dell", href: "/products?category=desktops&brand=dell" },
      { name: "HP", href: "/products?category=desktops&brand=hp" },
      { name: "Apple", href: "/products?category=desktops&brand=apple" },
    ] as BrandItem[],
  },
  {
    name: "Monitors", slug: "monitors", icon: "🖵",
    types: [
      { label: "4K Monitors", href: "/products?category=monitors&brand=lg" },
      { label: "Gaming Monitors", href: "/products?category=monitors&brand=samsung" },
      { label: "Professional Displays", href: "/products?category=monitors&brand=asus" },
      { label: "Business Monitors", href: "/products?category=monitors&brand=dell" },
      { label: "View All Monitors →", href: "/products?category=monitors", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Dell", href: "/products?category=monitors&brand=dell" },
      { name: "LG", href: "/products?category=monitors&brand=lg" },
      { name: "Samsung", href: "/products?category=monitors&brand=samsung" },
      { name: "ASUS", href: "/products?category=monitors&brand=asus" },
      { name: "HP", href: "/products?category=monitors&brand=hp" },
    ] as BrandItem[],
  },
  {
    name: "Components", slug: "pc-components", icon: "⚙️",
    types: [
      { label: "Graphics Cards (GPU)", href: "/products?category=pc-components&brand=asus" },
      { label: "Processors (CPU)", href: "/products?category=pc-components&brand=intel" },
      { label: "Memory (RAM)", href: "/products?category=pc-components&brand=corsair" },
      { label: "Internal SSDs", href: "/products?category=pc-components&brand=samsung" },
      { label: "View All Components →", href: "/products?category=pc-components", bold: true },
    ] as SubItem[],
    brands: [
      { name: "ASUS", href: "/products?category=pc-components&brand=asus" },
      { name: "Intel", href: "/products?category=pc-components&brand=intel" },
      { name: "Corsair", href: "/products?category=pc-components&brand=corsair" },
      { name: "Samsung", href: "/products?category=pc-components&brand=samsung" },
    ] as BrandItem[],
  },
  {
    name: "Networking", slug: "networking", icon: "📡",
    types: [
      { label: "WiFi 6 Routers", href: "/products?category=networking&brand=tp-link" },
      { label: "Network Switches", href: "/products?category=networking" },
      { label: "Enterprise Access Points", href: "/products?category=networking&brand=ubiquiti" },
      { label: "View All Networking →", href: "/products?category=networking", bold: true },
    ] as SubItem[],
    brands: [
      { name: "TP-Link", href: "/products?category=networking&brand=tp-link" },
      { name: "Ubiquiti", href: "/products?category=networking&brand=ubiquiti" },
    ] as BrandItem[],
  },
  {
    name: "Storage", slug: "storage", icon: "💾",
    types: [
      { label: "Portable SSDs", href: "/products?category=storage&brand=samsung" },
      { label: "Portable Hard Drives", href: "/products?category=storage&brand=western digital" },
      { label: "NAS Hard Drives", href: "/products?category=storage&brand=seagate" },
      { label: "View All Storage →", href: "/products?category=storage", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Samsung", href: "/products?category=storage&brand=samsung" },
      { name: "Seagate", href: "/products?category=storage&brand=seagate" },
      { name: "Western Digital", href: "/products?category=storage&brand=western digital" },
    ] as BrandItem[],
  },
  {
    name: "Peripherals", slug: "peripherals", icon: "🖱️",
    types: [
      { label: "Keyboards", href: "/products?category=peripherals&brand=logitech" },
      { label: "Mice", href: "/products?category=peripherals&brand=logitech" },
      { label: "Webcams", href: "/products?category=peripherals&brand=dell" },
      { label: "Headsets", href: "/products?category=peripherals" },
      { label: "View All Peripherals →", href: "/products?category=peripherals", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Logitech", href: "/products?category=peripherals&brand=logitech" },
      { name: "Dell", href: "/products?category=peripherals&brand=dell" },
    ] as BrandItem[],
  },
  {
    name: "Printers", slug: "printers", icon: "🖨️",
    types: [
      { label: "Laser Printers", href: "/products?category=printers&brand=hp" },
      { label: "Inkjet MFP", href: "/products?category=printers&brand=canon" },
      { label: "EcoTank Printers", href: "/products?category=printers&brand=epson" },
      { label: "View All Printers →", href: "/products?category=printers", bold: true },
    ] as SubItem[],
    brands: [
      { name: "HP", href: "/products?category=printers&brand=hp" },
      { name: "Canon", href: "/products?category=printers&brand=canon" },
      { name: "Epson", href: "/products?category=printers&brand=epson" },
    ] as BrandItem[],
  },
  {
    name: "Tablets", slug: "tablets", icon: "📱",
    types: [
      { label: "Windows 2-in-1", href: "/products?category=tablets&brand=microsoft" },
      { label: "Android Tablets", href: "/products?category=tablets&brand=samsung" },
      { label: "View All Tablets →", href: "/products?category=tablets", bold: true },
    ] as SubItem[],
    brands: [
      { name: "Microsoft", href: "/products?category=tablets&brand=microsoft" },
      { name: "Samsung", href: "/products?category=tablets&brand=samsung" },
    ] as BrandItem[],
  },
]

export function CategoryBar() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (slug: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActiveSlug(slug)
  }

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setActiveSlug(null), 120)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const active = CATEGORY_NAV.find((c) => c.slug === activeSlug)

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-30 border-b border-[#1a1a1a] bg-[#0d0d0d]/95 backdrop-blur-md"
      onMouseLeave={handleMouseLeave}
    >
      {/* Tab row */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {CATEGORY_NAV.map((cat) => (
            <button
              key={cat.slug}
              onMouseEnter={() => handleMouseEnter(cat.slug)}
              className={cn(
                "category-nav-tab flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all rounded-lg my-1 shrink-0",
                activeSlug === cat.slug
                  ? "text-blue-400 bg-[#1e2a3a]"
                  : "text-gray-100 hover:bg-[#2a2a2a]"
              )}
            >
              <span className="text-sm leading-none">{cat.icon}</span>
              {cat.name}
              <ChevronDown className={cn("h-3 w-3 transition-transform", activeSlug === cat.slug && "rotate-180")} />
            </button>
          ))}

          <div className="ml-auto shrink-0 pl-4">
            <Link
              href="/products?featured=true"
              className="category-nav-tab flex items-center gap-1 px-3 py-2.5 text-sm font-semibold text-yellow-400 hover:bg-[#2a2a2a] whitespace-nowrap transition-all rounded-lg my-1"
            >
              🏷️ Deals
            </Link>
          </div>
        </div>
      </div>

      {/* Mega-menu dropdown */}
      {active && (
        <div
          className="absolute left-0 right-0 bg-[#0f0f0f] border-b border-[#1e1e1e] shadow-2xl shadow-black/60 z-40"
          onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current) }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-8">
              {/* Sub-types column */}
              <div>
                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-3">
                  Browse by Type
                </p>
                <ul className="space-y-1">
                  {active.types.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveSlug(null)}
                        className={cn(
                          "block py-1.5 text-sm transition-colors",
                          item.bold
                            ? "text-blue-400 hover:text-blue-300 font-medium"
                            : "text-gray-200 hover:text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands column */}
              <div>
                <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-3">
                  Top Brands
                </p>
                <ul className="space-y-1">
                  {active.brands.map((brand) => (
                    <li key={brand.href}>
                      <Link
                        href={brand.href}
                        onClick={() => setActiveSlug(null)}
                        className="flex items-center gap-2.5 py-1.5 text-sm text-gray-200 hover:text-white transition-colors group"
                      >
                        <div className="h-5 w-5 rounded bg-blue-600/15 border border-blue-600/20 flex items-center justify-center shrink-0">
                          <span className="text-blue-400 font-bold text-[9px]">{brand.name[0]}</span>
                        </div>
                        <span className="group-hover:text-white">{brand.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured / CTA column */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-gray-600 font-semibold uppercase tracking-widest mb-3">
                    Quick Access
                  </p>
                  <Link
                    href={`/products?category=${active.slug}`}
                    onClick={() => setActiveSlug(null)}
                    className="block p-4 rounded-xl bg-gradient-to-br from-blue-900/40 to-blue-950/60 border border-blue-800/30 hover:border-blue-600/50 transition-all group"
                  >
                    <span className="text-3xl">{active.icon}</span>
                    <p className="text-white font-semibold text-sm mt-2">All {active.name}</p>
                    <p className="text-blue-400/70 text-xs mt-1 group-hover:text-blue-400 transition-colors">
                      Browse complete range →
                    </p>
                  </Link>
                </div>
                <Link
                  href="/products?featured=true"
                  onClick={() => setActiveSlug(null)}
                  className="mt-4 block px-4 py-2.5 rounded-lg border border-yellow-600/30 bg-yellow-950/20 text-yellow-400 text-xs font-medium hover:bg-yellow-950/40 transition-colors text-center"
                >
                  🏷️ View Deals &amp; Offers
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
