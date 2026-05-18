"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Search, Monitor, Menu, X, Info, Phone } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { startProgress } from "@/lib/progress"

interface NavbarProps {
  session: { user?: { name?: string | null; email?: string | null; role?: string } } | null
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, toggleCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])
  const itemCount = mounted ? totalItems() : 0

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      startProgress()
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Monitor className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block font-bold text-white text-lg tracking-tight">
                Quick<span className="text-blue-400">Cart</span>
              </span>
            </Link>

            {/* Nav links — desktop */}
            <div className="hidden lg:flex items-center gap-1 shrink-0">
              <Link
                href="/about"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
              >
                <Info className="h-3.5 w-3.5" />
                About Us
              </Link>
              <Link
                href="/support/contact"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
              >
                <Phone className="h-3.5 w-3.5" />
                Contact
              </Link>
            </div>

            {/* Inline Search Bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, monitors, components..."
                  className="w-full h-10 rounded-xl border border-[#2a2a2a] bg-[#111111] pl-10 pr-20 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-[#ffffff] text-xs font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[#ffffff] text-[10px] font-bold flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {session?.user ? (
                <div className="flex items-center gap-1.5">
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="hidden sm:block">
                      <Button variant="outline" size="sm" className="text-xs h-8">Admin</Button>
                    </Link>
                  )}
                  <Link href="/account">
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-[#ffffff] text-sm font-semibold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button size="sm" className="h-8">Sign In</Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 rounded-xl border border-[#2a2a2a] bg-[#111111] pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-all"
              />
            </form>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
            <Link href="/about" className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors">
              About Us
            </Link>
            <Link href="/support/contact" className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors">
              Contact Us
            </Link>
            {session?.user ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block px-3 py-2.5 rounded-lg text-sm text-blue-400 hover:bg-[#1a1a1a] transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link href="/account" className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                  My Account
                </Link>
                <Link href="/orders" className="block px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors">
                  My Orders
                </Link>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button className="w-full" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  )
}
