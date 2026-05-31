import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  noindex: true,
})

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/signin")
  }
  if (session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#f5f7fb" }}>
      <AdminSidebar />
      <main className="flex-1 md:ml-60 min-h-screen pt-14 md:pt-0">
        <div className="admin-content p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
