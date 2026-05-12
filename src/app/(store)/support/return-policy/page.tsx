import Link from "next/link"
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react"

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-orange-600/20 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Return Policy</h1>
          </div>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-gray-400 leading-relaxed">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5 text-center">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">14 Days</p>
              <p className="text-sm text-gray-500">Return window</p>
            </div>
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5 text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">Free</p>
              <p className="text-sm text-gray-500">Return pickup</p>
            </div>
            <div className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-5 text-center">
              <RotateCcw className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">3–5 Days</p>
              <p className="text-sm text-gray-500">Refund processing</p>
            </div>
          </div>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Eligible Returns</h2>
            <p className="mb-4">We accept returns within <strong className="text-white">14 days</strong> of delivery for the following reasons:</p>
            <ul className="space-y-2 text-sm">
              {[
                "Product arrived damaged or defective",
                "Product does not match the description on our website",
                "Wrong item was delivered",
                "Device fails to power on or has hardware issues on first use",
                "Missing accessories or components listed in the box contents",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold text-lg mb-4">Non-Returnable Items</h2>
            <ul className="space-y-2 text-sm">
              {[
                "Products with physical damage caused after delivery",
                "Items with broken seals or missing original packaging",
                "Products returned after the 14-day window",
                "Software or digital licenses that have been activated",
                "Customised or special-order configurations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
            <h2 className="text-white font-semibold text-lg mb-4">How to Return</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Submit a return request", desc: 'Go to My Orders, select the order, and click "Request Return". Provide the reason and any photos if applicable.' },
                { step: "2", title: "Wait for approval", desc: "Our team will review your request within 1–2 business days and notify you via email." },
                { step: "3", title: "Free pickup", desc: "Once approved, we will arrange a free courier pickup from your address at a convenient time." },
                { step: "4", title: "Inspection & refund", desc: "After we receive and inspect the item, your refund will be processed within 3–5 business days to your original payment method." },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <div className="h-7 w-7 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0 mt-0.5">{step}</div>
                  <div>
                    <p className="text-white font-medium">{title}</p>
                    <p className="text-sm mt-1">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <p className="text-sm">
            Questions? <Link href="/support/contact" className="text-blue-400 hover:text-blue-300">Contact our support team</Link> — we&apos;re happy to help.
          </p>
        </div>
      </div>
    </div>
  )
}
