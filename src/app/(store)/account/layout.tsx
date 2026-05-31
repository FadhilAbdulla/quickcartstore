import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = buildMetadata({
  title: "My Account",
  path: "/account",
  noindex: true,
})

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/signin")
  }
  return <>{children}</>
}
