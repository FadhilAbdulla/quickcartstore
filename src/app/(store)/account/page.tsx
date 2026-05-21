export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth"
import { Package, RotateCcw, ShieldCheck, ChevronRight, LogOut, Phone, Mail, CalendarDays } from "lucide-react"
import { AccountForm } from "@/components/store/account-form"
import { Badge } from "@/components/ui/badge"

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const userId = session.user.id
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  })
  if (!user) redirect("/auth/signin")

  const [orderCount, returnCount, recentOrders] = await Promise.all([
    db.order.count({ where: { userId } }),
    db.return.count({ where: { userId } }),
    db.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, orderNumber: true, status: true, totalAmount: true, createdAt: true },
    }),
  ])

  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-AE", { month: "long", year: "numeric" })

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10",
    CONFIRMED: "text-blue-400 bg-blue-400/10",
    PROCESSING: "text-blue-400 bg-blue-400/10",
    SHIPPED: "text-purple-400 bg-purple-400/10",
    DELIVERED: "text-green-400 bg-green-400/10",
    CANCELLED: "text-red-400 bg-red-400/10",
  }

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Profile header */}
        <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-bold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white truncate">{user.name || "No name set"}</h1>
                {user.role === "ADMIN" && (
                  <Badge variant="default" className="text-xs shrink-0">
                    <ShieldCheck className="h-3 w-3 mr-1" />Admin
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Mail className="h-3.5 w-3.5" />{user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <Phone className="h-3.5 w-3.5" />{user.phone}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-1.5 text-gray-600 text-xs mt-1">
                <CalendarDays className="h-3 w-3" />Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/orders"
            className="flex items-center gap-4 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors group"
          >
            <div className="h-11 w-11 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-white">{orderCount}</p>
              <p className="text-gray-500 text-sm">Orders</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
          </Link>

          <Link
            href="/returns"
            className="flex items-center gap-4 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors group"
          >
            <div className="h-11 w-11 rounded-xl bg-orange-600/15 flex items-center justify-center shrink-0">
              <RotateCcw className="h-5 w-5 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-white">{returnCount}</p>
              <p className="text-gray-500 text-sm">Returns</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
          </Link>
        </div>

        {/* Recent orders */}
        {recentOrders.length > 0 && (
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
              <h2 className="text-white font-semibold">Recent Orders</h2>
              <Link href="/orders" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#1a1a1a]">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#161616] transition-colors group"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-AE", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] ?? "text-gray-400 bg-gray-400/10"}`}>
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Profile form */}
        <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
          <h2 className="text-white font-semibold mb-1">Profile Information</h2>
          <p className="text-gray-500 text-sm mb-6">Update your name and phone number</p>
          <AccountForm user={{ name: user.name, email: user.email!, phone: user.phone }} />
        </div>

        {/* Admin shortcut */}
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="flex items-center gap-4 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors group"
          >
            <div className="h-11 w-11 rounded-xl bg-green-600/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Admin Panel</p>
              <p className="text-gray-500 text-sm">Manage products, orders and settings</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </Link>
        )}

        {/* Sign out */}
        <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
          <h2 className="text-white font-semibold mb-1">Sign Out</h2>
          <p className="text-gray-500 text-sm mb-4">You will be redirected to the home page</p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600/30 text-red-400 hover:bg-red-600/10 transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
