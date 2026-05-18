"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  RotateCcw,
  Users,
  Monitor,
  LogOut,
  Tag,
  FolderOpen,
  Ticket,
  Users2,
  Settings,
  Menu,
  X,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

import React from "react"

interface NavItem { href: string; label: string; icon: React.ElementType; exact?: boolean }
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/promocodes", label: "Promo Codes", icon: Ticket },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/returns", label: "Returns", icon: RotateCcw },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/brands", label: "Brands", icon: Tag },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/team", label: "Team", icon: Users2 },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
]

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#1e1e1e]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Monitor className="h-4 w-4 text-[#ffffff]" />
        </div>
        <div>
          <span className="font-bold text-[#ffffff] text-sm">
            Quick<span className="text-blue-400">Cart</span>
          </span>
          <p className="text-gray-500 text-[10px]">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNav}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-600/20"
                        : "text-gray-300 hover:text-[#ffffff] hover:bg-[#2a2a2a]"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-blue-400" : "text-gray-400")} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#1e1e1e]">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-[#ffffff] hover:bg-[#2a2a2a] transition-colors mb-1"
        >
          <Monitor className="h-4 w-4 text-gray-400 shrink-0" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-red-400 hover:bg-[#2a2a2a] transition-colors"
        >
          <LogOut className="h-4 w-4 text-gray-400 shrink-0" />
          Sign Out
        </button>
      </div>
    </>
  )
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-[#1e1e1e]" style={{ backgroundColor: "#0d0d0d" }}>
        <span className="font-bold text-[#ffffff] text-base">
          Quick<span className="text-blue-400">Cart</span>
          <span className="text-gray-500 text-xs font-normal ml-2">Admin</span>
        </span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-gray-300"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 border-r border-[#1e1e1e]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#0d0d0d" }}
      >
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col z-30 border-r border-[#1e1e1e]" style={{ backgroundColor: "#0d0d0d" }}>
        <SidebarContent />
      </aside>
    </>
  )
}
