"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, MapPin } from "lucide-react"
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

const UAE_LOCATIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]

function LocationChip() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("Dubai")
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        style={{ color: "#445574", backgroundColor: open ? "#eef3fa" : "transparent" }}
        onMouseOver={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f5f7fb" }}
        onMouseOut={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent" }}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#0066BA" }} />
        <span>{selected}</span>
        <ChevronDown className="h-3 w-3 shrink-0" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 rounded-xl shadow-xl border border-[#dde6f0] overflow-hidden z-50 min-w-[160px]"
          style={{ backgroundColor: "#fff" }}
        >
          {UAE_LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => { setSelected(loc); setOpen(false) }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[#eef3fa]"
              style={{ color: selected === loc ? "#0066BA" : "#445574", fontWeight: selected === loc ? 600 : 400 }}
            >
              {selected === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#0066BA] shrink-0" />}
              {selected !== loc && <span className="w-1.5 h-1.5 shrink-0" />}
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
      className="sticky top-16 z-30 border-b"
      style={{ backgroundColor: "#ffffff", borderColor: "#dde6f0" }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tab row */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto" style={{ scrollbarWidth: "none" }}>

          {/* Category tabs */}
          {CATEGORY_NAV.map((cat) => {
            const isActive = activeSlug === cat.slug
            return (
              <a
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                onMouseEnter={() => handleMouseEnter(cat.slug)}
                className="flex items-center gap-1 px-2.5 py-3 text-sm font-medium whitespace-nowrap transition-all shrink-0 border-b-2"
                style={{
                  color: isActive ? "#0066BA" : "#445574",
                  borderBottomColor: isActive ? "#0066BA" : "transparent",
                  backgroundColor: "transparent",
                }}
              >
                <span className="text-sm leading-none">{cat.icon}</span>
                <span>{cat.name}</span>
                <ChevronDown
                  className="hidden sm:block h-3 w-3 shrink-0 transition-transform"
                  style={{
                    color: isActive ? "#0066BA" : "#94a3b8",
                    transform: isActive ? "rotate(180deg)" : "none",
                  }}
                />
              </a>
            )
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right-side utility links */}
          <div className="flex items-center gap-1 shrink-0 pl-2 border-l ml-2" style={{ borderColor: "#e2ecf5" }}>
            <Link
              href="/products?featured=true"
              className="flex items-center gap-1 px-2.5 py-3 text-sm font-semibold whitespace-nowrap transition-colors"
              style={{ color: "#b45309" }}
            >
              🏷️ Deals
            </Link>
            <LocationChip />
          </div>
        </div>
      </div>

      {/* Mega-menu dropdown — desktop only */}
      {active && (
        <div
          className="hidden md:block absolute left-0 right-0 shadow-xl z-40 border-b"
          style={{ backgroundColor: "#051e44", borderColor: "#05193d" }}
          onMouseEnter={() => { if (timerRef.current) clearTimeout(timerRef.current) }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-3 gap-8">
              {/* Sub-types */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4da6e8" }}>
                  Browse by Type
                </p>
                <ul className="space-y-0.5">
                  {active.types.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setActiveSlug(null)}
                        className="block py-1.5 px-2 rounded text-sm transition-colors"
                        style={{ color: item.bold ? "#4da6e8" : "#bfdbfe" }}
                        onMouseOver={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.color = "#ffffff"
                          el.style.backgroundColor = "rgba(255,255,255,0.06)"
                        }}
                        onMouseOut={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.color = item.bold ? "#4da6e8" : "#bfdbfe"
                          el.style.backgroundColor = "transparent"
                        }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4da6e8" }}>
                  Top Brands
                </p>
                <ul className="space-y-0.5">
                  {active.brands.map((brand) => (
                    <li key={brand.href}>
                      <Link
                        href={brand.href}
                        onClick={() => setActiveSlug(null)}
                        className="flex items-center gap-2.5 py-1.5 px-2 rounded text-sm transition-colors"
                        style={{ color: "#bfdbfe" }}
                        onMouseOver={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.color = "#ffffff"
                          el.style.backgroundColor = "rgba(255,255,255,0.06)"
                        }}
                        onMouseOut={(e) => {
                          const el = e.currentTarget as HTMLAnchorElement
                          el.style.color = "#bfdbfe"
                          el.style.backgroundColor = "transparent"
                        }}
                      >
                        <div
                          className="h-5 w-5 rounded flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(0,102,186,0.3)", border: "1px solid rgba(0,102,186,0.4)" }}
                        >
                          <span className="font-bold text-[9px]" style={{ color: "#4da6e8" }}>{brand.name[0]}</span>
                        </div>
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick access */}
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "#4da6e8" }}>
                    Quick Access
                  </p>
                  <Link
                    href={`/products?category=${active.slug}`}
                    onClick={() => setActiveSlug(null)}
                    className="block p-4 rounded-xl transition-all"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,102,186,0.3) 0%, rgba(7,38,84,0.6) 100%)",
                      border: "1px solid rgba(0,102,186,0.3)",
                    }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,102,186,0.6)" }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(0,102,186,0.3)" }}
                  >
                    <span className="text-2xl">{active.icon}</span>
                    <p className="text-white font-semibold text-sm mt-2">All {active.name}</p>
                    <p className="text-sm mt-1" style={{ color: "#4da6e8" }}>Browse complete range →</p>
                  </Link>
                </div>
                <Link
                  href="/products?featured=true"
                  onClick={() => setActiveSlug(null)}
                  className="mt-3 block px-4 py-2 rounded-lg text-xs font-medium text-center transition-colors"
                  style={{ border: "1px solid rgba(251,191,36,0.35)", backgroundColor: "rgba(251,191,36,0.1)", color: "#fbbf24" }}
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
