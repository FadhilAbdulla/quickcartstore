export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import type { ReturnStatus } from "@prisma/client"
import { formatPrice } from "@/lib/utils"
import { getCurrency } from "@/lib/get-currency"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { RotateCcw } from "lucide-react"

const statusColors: Record<string, "default" | "success" | "warning" | "destructive" | "outline"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  REFUNDED: "default",
}

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const [returns, currency] = await Promise.all([
    db.return.findMany({
      where: {
        ...(params.status && { status: params.status as ReturnStatus }),
      },
      include: {
        user: true,
        product: { include: { brand: true } },
        order: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getCurrency(),
  ])

  const statuses = ["PENDING", "APPROVED", "REJECTED", "REFUNDED"]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Returns</h1>
        <p className="text-gray-500 text-sm mt-1">{returns.length} return requests</p>
      </div>

      <div className="flex gap-1 mb-6 flex-wrap">
        <a
          href="/admin/returns"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !params.status
              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
              : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
          }`}
        >
          All Returns
        </a>
        {statuses.map((s) => (
          <a
            key={s}
            href={`/admin/returns?status=${s}`}
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

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                <th className="text-left text-gray-500 font-medium px-5 py-3">Return ID</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Customer</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Product</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Order</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Qty</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Refund</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Status</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Date</th>
                <th className="text-right text-gray-500 font-medium px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <RotateCcw className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No return requests</p>
                  </td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-gray-400 text-xs font-mono">{ret.id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs">{ret.user?.name || "—"}</p>
                      <p className="text-gray-500 text-xs">{ret.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs truncate max-w-[140px]">{ret.product.name}</p>
                      <p className="text-gray-500 text-xs">{ret.product.brand.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${ret.orderId}`}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        {ret.order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{ret.quantity}</td>
                    <td className="px-4 py-3 text-white">
                      {ret.refundAmount ? formatPrice(Number(ret.refundAmount), currency) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusColors[ret.status] || "outline"}>{ret.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(ret.createdAt).toLocaleDateString("en-AE")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/returns/${ret.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Review
                      </Link>
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
