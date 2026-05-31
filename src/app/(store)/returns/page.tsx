export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { auth } from "@/lib/auth"

export const metadata: Metadata = buildMetadata({
  title: "My Returns",
  path: "/returns",
  noindex: true,
})
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RotateCcw, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { getCurrency } from "@/lib/get-currency"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  REFUNDED: "default",
}

const statusLabels: Record<string, string> = {
  PENDING: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REFUNDED: "Refunded",
}

export default async function ReturnsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const [returns, currency] = await Promise.all([
    db.return.findMany({
      where: { userId: session.user.id },
      include: {
        product: { include: { brand: true } },
        order: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getCurrency(),
  ])

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Returns</h1>
          <p className="text-gray-500 text-sm mt-1">Track your return requests</p>
        </div>

        {returns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-6">
              <RotateCcw className="h-10 w-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No returns yet</h2>
            <p className="text-gray-500 mb-8">You haven&apos;t submitted any return requests</p>
            <Link
              href="/orders"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition-colors"
            >
              View Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map((ret) => (
              <div
                key={ret.id}
                className="p-5 rounded-xl bg-[#111111] border border-[#1e1e1e]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-[#0f0f0f] flex items-center justify-center shrink-0 overflow-hidden">
                    {ret.product.images[0] ? (
                      <img
                        src={ret.product.images[0]}
                        alt={ret.product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-700" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs text-blue-400">{ret.product.brand.name}</p>
                        <p className="text-white font-medium truncate">{ret.product.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Qty: {ret.quantity}</p>
                      </div>
                      <Badge variant={statusColors[ret.status] || "outline"}>
                        {statusLabels[ret.status] ?? ret.status}
                      </Badge>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
                      <div>
                        <span className="text-gray-600">Order</span>{" "}
                        <Link
                          href={`/orders/${ret.orderId}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {ret.order.orderNumber}
                        </Link>
                      </div>
                      <div>
                        <span className="text-gray-600">Reason:</span> {ret.reason}
                      </div>
                      <div>
                        <span className="text-gray-600">Submitted:</span>{" "}
                        {new Date(ret.createdAt).toLocaleDateString("en-AE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {ret.refundAmount && (
                      <p className="mt-2 text-xs text-green-400">
                        Refund: {formatPrice(Number(ret.refundAmount), currency)}
                      </p>
                    )}

                    {ret.notes && (
                      <p className="mt-2 text-xs text-gray-400 italic">{ret.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
