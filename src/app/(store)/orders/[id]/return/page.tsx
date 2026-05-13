export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { ReturnForm } from "./return-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ReturnPage({
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
      returns: true,
    },
  })

  if (!order || order.userId !== session.user.id) notFound()
  if (order.status !== "DELIVERED") redirect(`/orders/${id}`)

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/orders/${id}`}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Order
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Request a Return</h1>
          <p className="text-gray-500 text-sm mt-1">Order {order.orderNumber}</p>
        </div>

        <ReturnForm order={order} />
      </div>
    </div>
  )
}
