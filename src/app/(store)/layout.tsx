import { auth } from "@/lib/auth"
import { Navbar } from "@/components/store/navbar"
import { Footer } from "@/components/store/footer"
import { CartDrawer } from "@/components/store/cart-drawer"
import { SessionProvider } from "@/components/store/session-provider"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider>
      <Navbar session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </SessionProvider>
  )
}
