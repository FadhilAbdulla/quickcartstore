export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, MapPin } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { getCurrency } from "@/lib/get-currency"
import { Badge } from "@/components/ui/badge"
import { OrderStatusUpdate } from "@/components/admin/order-status-update"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [order, currency] = await Promise.all([
    db.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: { include: { brand: true } } } },
        address: true,
      },
    }),
    getCurrency(),
  ])

  if (!order) notFound()

  return (
    <div>
      <Link
        href="/admin/orders"
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-AE", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Badge variant={statusColors[order.status] || "outline"} className="text-sm px-3 py-1">
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold mb-5">Items</h2>
            <div className="space-y-4">
              {order.items.map((item: (typeof order.items)[number]) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#0f0f0f] flex items-center justify-center shrink-0">
                    {item.product.images[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1 rounded-xl"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-400">{item.product.brand.name}</p>
                    <p className="text-white text-sm font-medium">{item.product.name}</p>
                    <p className="text-gray-500 text-xs">
                      {formatPrice(Number(item.price), currency)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-white font-semibold shrink-0">
                    {formatPrice(Number(item.price) * item.quantity, currency)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-[#1e1e1e] mt-5 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.totalAmount) / 1.05, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VAT (5%)</span>
                <span>{formatPrice(Number(order.totalAmount) - Number(order.totalAmount) / 1.05, currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-[#1e1e1e] pt-2">
                <span>Total</span>
                <span>{formatPrice(Number(order.totalAmount), currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Update Status */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
            <h2 className="text-white font-semibold mb-4">Update Status</h2>
            <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
          </div>

          {/* Customer */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
            <h2 className="text-white font-semibold mb-3">Customer</h2>
            <p className="text-white text-sm font-medium">{order.user?.name || "—"}</p>
            <p className="text-gray-400 text-sm">{order.user?.email}</p>
            {order.user?.phone && <p className="text-gray-400 text-sm">{order.user.phone}</p>}
          </div>

          {/* Delivery Address */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-400" />
              <h2 className="text-white font-semibold">Delivery Address</h2>
            </div>
            <div className="text-gray-400 text-sm space-y-0.5">
              <p className="text-white">{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.emirate}</p>
              <p>UAE</p>
            </div>
          </div>

          {order.notes && (
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
              <h2 className="text-white font-semibold mb-2">Notes</h2>
              <p className="text-gray-400 text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
