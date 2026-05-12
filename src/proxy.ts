import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session
  const isAdmin = (session?.user as any)?.role === "ADMIN"

  const isAdminRoute = nextUrl.pathname.startsWith("/admin")
  const isAuthRoute = nextUrl.pathname.startsWith("/auth")
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/checkout") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/account")

  if (isAdminRoute && !isAdmin) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
