export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { include: { brand: true } } } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here</p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Laptops
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-white font-semibold">{order.orderNumber}</p>
                      <Badge variant={statusColors[order.status] || "outline"}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-AE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                      {" · "}
                      {order.items
                        .map((i) => i.product.brand.name)
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-semibold text-lg">
                      {formatPrice(Number(order.totalAmount))}
                    </p>
                    <p className="text-blue-400 text-sm mt-1">View details →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
