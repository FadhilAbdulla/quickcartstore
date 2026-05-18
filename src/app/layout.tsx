export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { TopLoader } from "@/components/top-loader"
import { db } from "@/lib/db"
import { CurrencyProvider } from "@/context/currency-context"

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
    default: "QuickCart - IT Products Store in UAE",
    template: "%s | QuickCart UAE",
  },
  description:
    "Shop laptops, monitors, networking, PC components, printers, storage and more. Authentic products, fast delivery across UAE.",
  keywords: ["IT store UAE", "laptops Dubai", "monitors UAE", "networking equipment UAE", "PC components UAE"],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [themeSetting, currencySetting] = await Promise.all([
    db.settings.findUnique({ where: { key: "theme" } }),
    db.settings.findUnique({ where: { key: "currency" } }),
  ])
  const theme = themeSetting?.value === "light" ? "light" : "dark"
  const currency = currencySetting?.value ?? "AED"

  return (
    <html lang="en" data-theme={theme} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <CurrencyProvider currency={currency}>
        <TopLoader color={theme === "light" ? "#2563eb" : "#ffffff"} height={2} />
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
        </CurrencyProvider>
      </body>
    </html>
  )
}
