import { auth } from "@/lib/auth"
import { Navbar } from "./navbar"
import { CategoryBar } from "./category-bar"
import { Footer } from "./footer"
import { CartDrawer } from "./cart-drawer"
import { SessionProvider } from "./session-provider"

export async function StoreLayoutWrapper({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <SessionProvider>
      <Navbar session={session} />
      <CategoryBar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </SessionProvider>
  )
}
