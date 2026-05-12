"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Search, Laptop, Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/products", label: "All Laptops" },
  { href: "/products?brand=apple", label: "Apple" },
  { href: "/products?brand=dell", label: "Dell" },
  { href: "/products?brand=lenovo", label: "Lenovo" },
  { href: "/products?brand=hp", label: "HP" },
]

interface NavbarProps {
  session: { user?: { name?: string | null; email?: string | null; role?: string } } | null
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItems, toggleCart } = useCartStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  useEffect(() => setMounted(true), [])
  const itemCount = mounted ? totalItems() : 0

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#1e1e1e] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Laptop className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Quick<span className="text-blue-400">Cart</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 flex-1 mx-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap",
                    pathname === link.href || (link.href !== "/products" && pathname + "?" === link.href.split("?")[0] + "?")
                      ? "text-white bg-[#1a1a1a]"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-lg transition-colors",
                  searchOpen ? "bg-blue-600/20 text-blue-400" : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                )}
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative h-9 w-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
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
                    <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
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
        </div>

        {/* Search bar — slide down */}
        {searchOpen && (
          <div className="border-t border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search laptops, brands, models..."
                  className="w-full h-11 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <Button type="submit" className="h-11 px-6">Search</Button>
              <button type="button" onClick={() => setSearchOpen(false)} className="h-11 w-11 flex items-center justify-center rounded-xl text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-colors border border-[#2a2a2a]">
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#1a1a1a] mt-2 space-y-1">
              {session?.user ? (
                <>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" className="block px-3 py-2.5 rounded-lg text-sm text-blue-400 hover:bg-[#1a1a1a] transition-colors">Admin Panel</Link>
                  )}
                  <Link href="/account" className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">My Account</Link>
                  <Link href="/orders" className="block px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors">My Orders</Link>
                </>
              ) : (
                <Link href="/auth/signin">
                  <Button className="w-full mt-1" size="sm">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Search backdrop */}
      {searchOpen && (
        <div className="fixed inset-0 z-30 bg-black/40" onClick={() => setSearchOpen(false)} />
      )}
    </>
  )
}
