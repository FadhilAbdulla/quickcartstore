export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth"
import { Package, RotateCcw, User, LogOut, ShieldCheck } from "lucide-react"
import { AccountForm } from "@/components/store/account-form"

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const userId = session.user.id
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  })
  if (!user) redirect("/auth/signin")

  const [orderCount, returnCount] = await Promise.all([
    db.order.count({ where: { userId } }),
    db.return.count({ where: { userId } }),
  ])

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/orders"
            className="flex flex-col items-center gap-2 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors text-center"
          >
            <div className="h-10 w-10 rounded-full bg-blue-600/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{orderCount}</span>
            <span className="text-gray-500 text-sm">Orders</span>
          </Link>

          <Link
            href="/returns"
            className="flex flex-col items-center gap-2 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] hover:border-[#2a2a2a] transition-colors text-center"
          >
            <div className="h-10 w-10 rounded-full bg-orange-600/20 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-orange-400" />
            </div>
            <span className="text-2xl font-bold text-white">{returnCount}</span>
            <span className="text-gray-500 text-sm">Returns</span>
          </Link>

          <div className="flex flex-col items-center gap-2 p-5 rounded-xl bg-[#111111] border border-[#1e1e1e] text-center">
            <div className="h-10 w-10 rounded-full bg-green-600/20 flex items-center justify-center">
              {user.role === "ADMIN" ? (
                <ShieldCheck className="h-5 w-5 text-green-400" />
              ) : (
                <User className="h-5 w-5 text-green-400" />
              )}
            </div>
            <span className="text-sm font-semibold text-white">{user.role}</span>
            <span className="text-gray-500 text-xs">
              Since {new Date(user.createdAt).toLocaleDateString("en-AE", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6 mb-4">
          <h2 className="text-white font-semibold mb-6">Profile Information</h2>
          <AccountForm user={{ name: user.name, email: user.email!, phone: user.phone }} />
        </div>

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
