import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

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
    <div className="flex min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <AdminSidebar />
      <main className="flex-1 md:ml-60 min-h-screen pt-14 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
