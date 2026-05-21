"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Search, Menu, X } from "lucide-react"
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
      <header
        className="sticky top-0 z-40 border-b border-[#05193d]"
        style={{ backgroundColor: "#072654" }}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 mr-6">
              <Image
                src="/logo-white.svg"
                alt="QuickCart UAE"
                width={160}
                height={30}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Inline Search Bar — desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2 relative">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 pointer-events-none" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, monitors, components..."
                  className="w-full h-10 rounded-xl border border-white/20 bg-white/10 pl-10 pr-20 text-sm text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-[#0066BA]/60 focus:border-[#0066BA]/60 focus:bg-white/15 transition-all"
                  style={{ color: "white" }}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-lg text-white text-xs font-semibold transition-colors"
                  style={{ backgroundColor: "#0066BA" }}
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
                className="relative h-9 w-9 flex items-center justify-center rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: "#ED1D32" }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* User */}
              {session?.user ? (
                <div className="flex items-center gap-1.5">
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="hidden sm:block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 border-white/30 text-white hover:bg-white/10 hover:text-white"
                        style={{ backgroundColor: "transparent" }}
                      >
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Link href="/account">
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: "#0066BA" }}
                    >
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </Link>
                </div>
              ) : (
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button
                    size="sm"
                    className="h-8 text-white"
                    style={{ backgroundColor: "#0066BA" }}
                  >
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 rounded-xl border border-white/20 bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-[#0066BA]/60 transition-all"
                style={{ color: "white" }}
              />
            </form>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-white/10 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto"
            style={{ backgroundColor: "#072654" }}
          >
            <Link href="/about" className="block px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-colors">
              About Us
            </Link>
            <Link href="/support/contact" className="block px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
            {session?.user ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="block px-3 py-2.5 rounded-lg text-sm text-[#0066BA] hover:bg-white/10 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link href="/account" className="block px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-colors">
                  My Account
                </Link>
                <Link href="/orders" className="block px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-colors">
                  My Orders
                </Link>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button className="w-full text-white" size="sm" style={{ backgroundColor: "#0066BA" }}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  )
}
