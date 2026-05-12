export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag } from "lucide-react"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const where: any = {}
  if (params.status) where.status = params.status
  if (params.search) {
    where.OR = [
      { orderNumber: { contains: params.search, mode: "insensitive" } },
      { user: { name: { contains: params.search, mode: "insensitive" } } },
      { user: { email: { contains: params.search, mode: "insensitive" } } },
    ]
  }

  const orders = await db.order.findMany({
    where,
    include: { user: true, items: true, address: true },
    orderBy: { createdAt: "desc" },
  })

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} orders</p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        <a
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !params.status
              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
              : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
          }`}
        >
          All Orders
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              params.status === s
                ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
            }`}
          >
            {s}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                <th className="text-left text-gray-500 font-medium px-5 py-3">Order</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Customer</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Items</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Total</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Emirate</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <ShoppingBag className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found</p>
                  </td>
                </tr>
              ) : (
                orders.map((order: (typeof orders)[number]) => (
                  <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs">{order.user?.name || "—"}</p>
                      <p className="text-gray-500 text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{order.items.length}</td>
                    <td className="px-4 py-3 text-white font-medium">
                      {formatPrice(Number(order.totalAmount))}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{order.address?.emirate}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[order.status] || "outline"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-AE")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
