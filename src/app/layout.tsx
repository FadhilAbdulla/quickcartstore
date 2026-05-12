export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import NextTopLoader from "nextjs-toploader"
import { db } from "@/lib/db"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "QuickCart - Premium Laptops in UAE",
    template: "%s | QuickCart UAE",
  },
  description:
    "Shop the latest laptops from Apple, Dell, Lenovo, HP, ASUS and more. Authentic products, fast delivery across UAE.",
  keywords: ["laptops UAE", "buy laptop Dubai", "MacBook UAE", "Dell XPS UAE", "gaming laptop UAE"],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const themeSetting = await db.settings.findUnique({ where: { key: "theme" } })
  const theme = themeSetting?.value === "light" ? "light" : "dark"

  return (
    <html lang="en" data-theme={theme} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <NextTopLoader color={theme === "light" ? "#000000" : "#ffffff"} height={2} showSpinner={false} />
        {children}
        <Toaster
          theme={theme as "dark" | "light"}
          position="bottom-right"
          toastOptions={{
            style:
              theme === "light"
                ? { background: "#ffffff", border: "1px solid #e5e5e5", color: "#111111" }
                : { background: "#111111", border: "1px solid #2a2a2a", color: "#ffffff" },
          }}
        />
      </body>
    </html>
  )
}
