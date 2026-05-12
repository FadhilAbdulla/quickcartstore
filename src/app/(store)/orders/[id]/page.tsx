export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, MapPin } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline" | "secondary"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
}

const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: { include: { brand: true } } } },
      address: true,
    },
  })

  if (!order || order.userId !== session.user.id) notFound()

  const currentStep = statusSteps.indexOf(order.status)
  const isCancelled = order.status === "CANCELLED"

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-AE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Badge variant={statusColors[order.status] || "outline"} className="text-sm px-3 py-1">
            {order.status}
          </Badge>
        </div>

        {/* Order Progress */}
        {!isCancelled && (
          <div className="mb-8 p-6 rounded-xl bg-[#111111] border border-[#1e1e1e]">
            <h2 className="text-white font-semibold mb-5">Order Progress</h2>
            <div className="flex items-center gap-0 overflow-x-auto">
              {statusSteps.map((step, idx) => (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        idx <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-[#1a1a1a] text-gray-600 border border-[#2a2a2a]"
                      }`}
                    >
                      {idx <= currentStep ? "✓" : idx + 1}
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center ${idx <= currentStep ? "text-blue-400" : "text-gray-600"}`}>
                      {step.charAt(0) + step.slice(1).toLowerCase()}
                    </p>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-1 ${
                        idx < currentStep ? "bg-blue-600" : "bg-[#1e1e1e]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl bg-[#111111] border border-[#1e1e1e] p-6">
              <h2 className="text-white font-semibold mb-4">
                Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[#0f0f0f] flex items-center justify-center shrink-0">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-blue-400">{item.product.brand.name}</p>
                      <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {formatPrice(Number(item.price))} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-white font-semibold text-sm shrink-0">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return button */}
            {order.status === "DELIVERED" && (
              <div className="p-4 rounded-xl border border-[#1e1e1e] bg-[#111111] flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Need to return something?</p>
                  <p className="text-gray-500 text-xs">Returns accepted within 14 days of delivery</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/orders/${order.id}/return`}>Request Return</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Summary & Address */}
          <div className="space-y-4">
            {/* Price */}
            <div className="rounded-xl bg-[#111111] border border-[#1e1e1e] p-5">
              <h2 className="text-white font-semibold mb-4">Payment</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(order.totalAmount) / 1.05)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>VAT (5%)</span>
                  <span>{formatPrice(Number(order.totalAmount) - Number(order.totalAmount) / 1.05)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-base pt-2 border-t border-[#1e1e1e]">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.totalAmount))}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-3">Payment: Cash on Delivery</p>
            </div>

            {/* Delivery Address */}
            <div className="rounded-xl bg-[#111111] border border-[#1e1e1e] p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <h2 className="text-white font-semibold">Delivery Address</h2>
              </div>
              <div className="text-gray-400 text-sm space-y-0.5">
                <p className="text-white font-medium">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>
                  {order.address.city}, {order.address.emirate}
                </p>
                <p>UAE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
