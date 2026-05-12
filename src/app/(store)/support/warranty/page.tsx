import Link from "next/link"
import { ShieldCheck, Wrench, AlertCircle, CheckCircle } from "lucide-react"

export default function WarrantyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-green-600/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Warranty Information</h1>
          </div>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-gray-400 leading-relaxed">

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Manufacturer Warranty</h2>
            <p className="mb-4">All products sold by QuickCart come with the <strong className="text-white">official manufacturer warranty</strong>. Warranty terms vary by brand:</p>
            <div className="space-y-3">
              {[
                { brand: "Apple", warranty: "1 year limited warranty + optional AppleCare+" },
                { brand: "Dell", warranty: "1 year ProSupport or Basic warranty (varies by model)" },
                { brand: "Lenovo", warranty: "1 year depot or on-site warranty" },
                { brand: "HP", warranty: "1 year limited hardware warranty" },
                { brand: "ASUS", warranty: "1–2 years depending on model" },
                { brand: "Microsoft Surface", warranty: "1 year limited hardware warranty" },
                { brand: "Samsung", warranty: "1 year manufacturer warranty" },
              ].map(({ brand, warranty }) => (
                <div key={brand} className="flex gap-4 py-3 border-b border-[#1a1a1a] last:border-0">
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium text-sm">{brand}</p>
                    <p className="text-xs text-gray-500">{warranty}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-4 w-4 text-blue-400" />
              <h2 className="text-white font-semibold text-lg">What Is Covered</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Manufacturing defects in materials or workmanship",
                "Hardware component failures (battery, keyboard, screen — under normal use)",
                "Logic board or motherboard failures not caused by user damage",
                "Factory-installed software issues",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <h2 className="text-white font-semibold text-lg">What Is Not Covered</h2>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "Physical or accidental damage (drops, spills, cracks)",
                "Damage from unauthorised modifications or repairs",
                "Normal wear and tear (cosmetic scratches, battery degradation over time)",
                "Software viruses or third-party software issues",
                "Damage caused by improper use or storage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold text-lg mb-3">How to Claim Warranty</h2>
            <p className="text-sm mb-4">
              To initiate a warranty claim, <Link href="/support/contact" className="text-blue-400 hover:text-blue-300">contact our support team</Link> with your order number and a description of the issue. We will assist you in coordinating with the manufacturer&apos;s authorised service centre in the UAE.
            </p>
            <p className="text-sm">
              For Apple products, you can also visit the nearest Apple Authorised Service Provider in the UAE directly with proof of purchase.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
