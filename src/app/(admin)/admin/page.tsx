export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { getCurrency } from "@/lib/get-currency"
import Link from "next/link"
import {
  ShoppingBag,
  Package,
  RotateCcw,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

async function getDashboardStats() {
  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    pendingReturns,
    totalCustomers,
    revenueResult,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.count({ where: { isActive: true } }),
    db.product.findMany({
      where: { stock: { lte: 5 }, isActive: true },
      include: { brand: true },
      take: 5,
    }),
    db.return.count({ where: { status: "PENDING" } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"] } },
    }),
    db.order.findMany({
      include: { user: true, items: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ])

  return {
    totalOrders,
    pendingOrders,
    totalProducts,
    lowStockProducts,
    pendingReturns,
    totalCustomers,
    totalRevenue: Number(revenueResult._sum.totalAmount || 0),
    recentOrders,
  }
}

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
}

export default async function AdminDashboard() {
  const [stats, currency] = await Promise.all([getDashboardStats(), getCurrency()])

  const cards = [
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue, currency),
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
      sub: `${stats.totalOrders} total orders`,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: ShoppingBag,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      sub: "Awaiting confirmation",
      href: "/admin/orders?status=PENDING",
    },
    {
      title: "Active Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      sub: `${stats.lowStockProducts.length} low stock`,
      href: "/admin/products",
    },
    {
      title: "Pending Returns",
      value: stats.pendingReturns.toString(),
      icon: RotateCcw,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      sub: "Awaiting review",
      href: "/admin/returns",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      sub: "Registered accounts",
      href: "/admin/customers",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-AE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2a2a2a] transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              {card.href && (
                <Link href={card.href}>
                  <ArrowRight className="h-4 w-4 text-gray-600 hover:text-gray-400 transition-colors" />
                </Link>
              )}
            </div>
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-xs text-gray-600 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-[#111111] border border-[#1e1e1e] rounded-xl">
          <div className="flex items-center justify-between p-5 border-b border-[#1e1e1e]">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-blue-400 text-sm hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {stats.recentOrders.length === 0 ? (
              <p className="p-5 text-gray-500 text-sm">No orders yet</p>
            ) : (
              stats.recentOrders.map((order: (typeof stats.recentOrders)[number]) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs truncate">{order.user?.name || order.user?.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm">{formatPrice(Number(order.totalAmount), currency)}</p>
                    <p className="text-gray-600 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-AE")}
                    </p>
                  </div>
                  <Badge variant={statusColors[order.status] || "outline"} className="shrink-0">
                    {order.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl">
          <div className="flex items-center gap-2 p-5 border-b border-[#1e1e1e]">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <h2 className="text-white font-semibold">Low Stock Alert</h2>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {stats.lowStockProducts.length === 0 ? (
              <p className="p-5 text-gray-500 text-sm">All products are well stocked</p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{product.name}</p>
                    <p className="text-gray-500 text-xs">{product.brand.name}</p>
                  </div>
                  <span
                    className={`text-sm font-semibold shrink-0 ${
                      product.stock === 0 ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </Link>
              ))
            )}
          </div>
          <div className="p-4 border-t border-[#1e1e1e]">
            <Link
              href="/admin/products"
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              Manage inventory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
