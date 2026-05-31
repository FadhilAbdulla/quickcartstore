import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  path: "/auth/signin",
  noindex: true,
})

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session?.user) {
    redirect("/")
  }
  return <div className="auth-content">{children}</div>
}
