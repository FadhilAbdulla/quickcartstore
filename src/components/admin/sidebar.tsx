"use client"

import Link from "next/link"
import Image from "next/image"
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
  Image as ImageIcon,
  MapPin,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

import React from "react"

interface NavItem { href: string; label: string; icon: React.ElementType; exact?: boolean }
interface NavGroup { label: string; icon: React.ElementType; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Store",
    icon: Package,
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/banners", label: "Banners", icon: ImageIcon },
      { href: "/admin/promocodes", label: "Promo Codes", icon: Ticket },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/returns", label: "Returns", icon: RotateCcw },
      { href: "/admin/brands", label: "Brands", icon: Tag },
      { href: "/admin/categories", label: "Categories", icon: FolderOpen },
      { href: "/admin/blogs", label: "Blog Posts", icon: BookOpen },
    ],
  },
  {
    label: "People",
    icon: Users,
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/team", label: "Team", icon: Users2 },
    ],
  },
  {
    label: "System",
    icon: Settings,
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
]

const locations = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
]

function LocationDropdown() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("Dubai")

  return (
    <div className="relative px-3 py-2 border-b border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <MapPin className="h-3.5 w-3.5 text-blue-300 shrink-0" />
        <span className="flex-1 text-left text-sm font-medium truncate">{selected}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-blue-300 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="absolute left-3 right-3 mt-1 rounded-lg overflow-hidden shadow-lg z-50 border border-white/15"
          style={{ backgroundColor: "#051e44" }}
        >
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => { setSelected(loc); setOpen(false) }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-white/10",
                selected === loc ? "text-white font-medium" : "text-blue-200"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", selected === loc ? "bg-[#0066BA]" : "")} />
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()

  const getDefaultOpen = () => {
    for (const group of navGroups) {
      for (const item of group.items) {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        if (active) return group.label
      }
    }
    return "Overview"
  }

  const [openGroup, setOpenGroup] = useState<string>(getDefaultOpen)

  const toggleGroup = (label: string) => {
    setOpenGroup((prev) => (prev === label ? "" : label))
  }

  return (
    <>
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-white/10">
        <Link href="/admin" onClick={onNav}>
          <Image
            src="/logo-white.svg"
            alt="QuickCart"
            width={140}
            height={26}
            className="h-7 w-auto"
            priority
          />
        </Link>
      </div>

      {/* Location dropdown */}
      <LocationDropdown />

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navGroups.map((group) => {
          const isGroupOpen = openGroup === group.label
          const hasActiveItem = group.items.some((item) =>
            item.exact ? pathname === item.href : pathname.startsWith(item.href)
          )

          return (
            <div key={group.label}>
              {/* Group header - clickable */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors",
                  hasActiveItem
                    ? "text-blue-200 bg-white/5"
                    : "text-blue-400 hover:text-blue-200 hover:bg-white/5"
                )}
              >
                <group.icon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 text-left">{group.label}</span>
                <ChevronRight
                  className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isGroupOpen && "rotate-90")}
                />
              </button>

              {/* Group items */}
              {isGroupOpen && (
                <div className="mt-1 space-y-0.5 pl-2">
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
                            ? "text-white border border-white/20"
                            : "text-blue-200 hover:text-white hover:bg-white/10"
                        )}
                        style={isActive ? { backgroundColor: "#0066BA" } : undefined}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-blue-300")} />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/10">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-white/10 transition-colors mb-1"
        >
          <Monitor className="h-4 w-4 text-blue-300 shrink-0" />
          View Store
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-200 hover:text-white hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="h-4 w-4 text-blue-300 shrink-0" />
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
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/10"
        style={{ backgroundColor: "#072654" }}
      >
        <Image
          src="/logo-white.svg"
          alt="QuickCart"
          width={120}
          height={22}
          className="h-6 w-auto"
        />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-blue-200"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 border-r border-white/10",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#072654" }}
      >
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </aside>

      <aside
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col z-30 border-r border-white/10"
        style={{ backgroundColor: "#072654" }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
