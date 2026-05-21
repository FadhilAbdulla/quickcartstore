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
    default: "QuickCart — IT Products Store Dubai, UAE",
    template: "%s | QuickCart UAE",
  },
  description:
    "Shop laptops, desktops, gaming PCs, monitors, networking, PC components, printers, storage and more. Authentic products with UAE warranty. Fast delivery across Dubai and UAE.",
  keywords: [
    "IT store Dubai", "laptops Dubai", "gaming PC Dubai", "monitors UAE",
    "networking equipment UAE", "PC components Dubai", "buy laptop UAE",
    "computer store Dubai", "HP Dell Lenovo dealer UAE", "ASUS ROG Dubai",
  ],
  openGraph: {
    type: "website",
    locale: "en_AE",
    siteName: "QuickCart UAE",
    title: "QuickCart — IT Products Store Dubai, UAE",
    description: "Laptops, gaming rigs, monitors, networking, components and more — authentic, fast delivery across UAE.",
    images: [{ url: "/logo.svg", width: 799, height: 145, alt: "QuickCart UAE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickCart — IT Products Store Dubai, UAE",
    description: "Laptops, gaming rigs, monitors, networking, components and more — authentic, fast delivery across UAE.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://quickcart.ae"),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currencySetting = await db.settings.findUnique({ where: { key: "currency" } })
  const currency = currencySetting?.value ?? "AED"

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f7fb] text-[#072654]">
        <CurrencyProvider currency={currency}>
          <TopLoader color="#0066BA" height={3} />
          {children}
          <Toaster
            theme="light"
            position="bottom-right"
            toastOptions={{
              style: { background: "#ffffff", border: "1px solid #dde6f0", color: "#072654" },
            }}
          />
        </CurrencyProvider>
      </body>
    </html>
  )
}
