import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import Link from "next/link"
import { Truck, Clock, MapPin, Package, AlertCircle } from "lucide-react"

export const metadata: Metadata = buildMetadata({
  title: "Shipping Policy",
  description:
    "Free delivery across UAE — same-day in Dubai, next-day to Abu Dhabi & Sharjah. QuickCart ships all IT products within the UAE with no minimum order.",
  path: "/support/shipping-policy",
  keywords: ["free shipping UAE", "delivery Dubai IT products", "QuickCart shipping policy"],
})

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Shipping Policy</h1>
          </div>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-gray-400 leading-relaxed">

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-blue-400" />
              <h2 className="text-white font-semibold text-lg">Delivery Timeframes</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]">
                <div>
                  <p className="text-white font-medium">Dubai</p>
                  <p className="text-sm">Same-day or next-day delivery</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-xs font-medium">1–2 days</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]">
                <div>
                  <p className="text-white font-medium">Abu Dhabi &amp; Sharjah</p>
                  <p className="text-sm">Express delivery available</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-xs font-medium">1–3 days</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]">
                <div>
                  <p className="text-white font-medium">Ajman, RAK, Umm Al Quwain</p>
                  <p className="text-sm">Standard delivery</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-600/20 text-yellow-400 text-xs font-medium">2–4 days</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <div>
                  <p className="text-white font-medium">Fujairah &amp; Remote Areas</p>
                  <p className="text-sm">Standard delivery</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-400 text-xs font-medium">3–5 days</span>
              </div>
            </div>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-blue-400" />
              <h2 className="text-white font-semibold text-lg">Shipping Fees</h2>
            </div>
            <p className="mb-4">We offer <span className="text-white font-semibold">free shipping</span> on all orders across the UAE. No minimum order value required.</p>
            <div className="p-4 rounded-lg bg-green-600/10 border border-green-600/20 text-green-400 text-sm font-medium">
              Free delivery on all orders — no hidden charges
            </div>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-blue-400" />
              <h2 className="text-white font-semibold text-lg">Order Tracking</h2>
            </div>
            <p className="mb-3">Once your order is dispatched, you will receive an SMS and email confirmation with your tracking details. You can also track your order from your <Link href="/orders" className="text-blue-400 hover:text-blue-300">orders page</Link>.</p>
            <p>Orders are processed Monday–Saturday, 9 AM–6 PM GST. Orders placed on Fridays or public holidays will be processed the next business day.</p>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <h2 className="text-white font-semibold text-lg">Important Notes</h2>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> Ensure your delivery address and phone number are correct at checkout.</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> Someone must be available to receive the package — we do not leave parcels unattended.</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> For bulk or corporate orders, please <Link href="/support/contact" className="text-blue-400 hover:text-blue-300">contact us</Link> for special arrangements.</li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">•</span> We currently ship within the UAE only.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
