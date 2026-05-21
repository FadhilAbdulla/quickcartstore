export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { getCurrency } from "@/lib/get-currency"
import { Badge } from "@/components/ui/badge"
import { ReturnActionButtons } from "@/components/admin/return-action-buttons"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  REFUNDED: "default",
}

export default async function AdminReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [ret, currency] = await Promise.all([
    db.return.findUnique({
      where: { id },
      include: {
        user: true,
        product: { include: { brand: true } },
        order: true,
      },
    }),
    getCurrency(),
  ])

  if (!ret) notFound()

  return (
    <div>
      <Link
        href="/admin/returns"
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Returns
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Return Request</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(ret.createdAt).toLocaleDateString("en-AE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant={statusColors[ret.status] || "outline"} className="text-sm px-3 py-1">
          {ret.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Product */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold mb-4">Product Details</h2>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#0f0f0f] flex items-center justify-center shrink-0">
                {ret.product.images[0] && (
                  <img
                    src={ret.product.images[0]}
                    alt={ret.product.name}
                    className="w-full h-full object-contain p-1 rounded-xl"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-blue-400">{ret.product.brand.name}</p>
                <p className="text-white font-medium">{ret.product.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Quantity to return: {ret.quantity}
                </p>
                <p className="text-gray-500 text-sm">
                  Order:{" "}
                  <Link href={`/admin/orders/${ret.orderId}`} className="text-blue-400 hover:text-blue-300">
                    {ret.order.orderNumber}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold mb-3">Return Reason</h2>
            <p className="text-gray-400">{ret.reason}</p>
          </div>

          {ret.notes && (
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
              <h2 className="text-white font-semibold mb-3">Admin Notes</h2>
              <p className="text-gray-400">{ret.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
            <h2 className="text-white font-semibold mb-3">Customer</h2>
            <p className="text-white text-sm">{ret.user?.name || "—"}</p>
            <p className="text-gray-400 text-sm">{ret.user?.email}</p>
          </div>

          {/* Refund */}
          {ret.refundAmount && (
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
              <h2 className="text-white font-semibold mb-2">Refund Amount</h2>
              <p className="text-2xl font-bold text-green-400">
                {formatPrice(Number(ret.refundAmount), currency)}
              </p>
            </div>
          )}

          {/* Actions */}
          {ret.status === "PENDING" && (
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5">
              <h2 className="text-white font-semibold mb-4">Actions</h2>
              <ReturnActionButtons returnId={ret.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
