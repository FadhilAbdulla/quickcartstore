export const dynamic = "force-dynamic"

import { db } from "@/lib/db"
import { Users } from "lucide-react"

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{customers.length} registered customers</p>
      </div>

      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e] bg-[#0f0f0f]">
                <th className="text-left text-gray-500 font-medium px-5 py-3">Customer</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Phone</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Orders</th>
                <th className="text-left text-gray-500 font-medium px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <Users className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500">No customers yet</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-semibold">
                          {customer.name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm">{customer.name || "—"}</p>
                          <p className="text-gray-500 text-xs">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{customer.phone || "—"}</td>
                    <td className="px-4 py-3 text-white">{customer._count.orders}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(customer.createdAt).toLocaleDateString("en-AE")}
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
