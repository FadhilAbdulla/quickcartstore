import { auth } from "@/lib/auth"
import { Navbar } from "@/components/store/navbar"
import { CategoryBar } from "@/components/store/category-bar"
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
      <CategoryBar />
      <main className="flex-1 store-content">{children}</main>
      <Footer />
      <CartDrawer />
    </SessionProvider>
  )
}
