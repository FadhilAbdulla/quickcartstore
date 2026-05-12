"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  RotateCcw,
  Users,
  Laptop,
  LogOut,
  Tag,
  FolderOpen,
  Ticket,
  Users2,
  Settings,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

interface NavItem { href: string; label: string; icon: React.ElementType; exact?: boolean }
interface NavGroup { label: string; items: NavItem[] }

import React from "react"

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

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0a0a0a] border-r border-[#1e1e1e] flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#1e1e1e]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Laptop className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="font-bold text-white text-sm">
            Quick<span className="text-blue-400">Cart</span>
          </span>
          <p className="text-gray-600 text-[10px]">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-3 mb-1">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-600/20"
                        : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-gray-500")} />
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition-colors mb-1"
        >
          <Laptop className="h-4 w-4 text-gray-500" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] transition-colors"
        >
          <LogOut className="h-4 w-4 text-gray-500" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
