"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Delivery times depend on your emirate. Dubai orders typically arrive in 1–2 days, Abu Dhabi and Sharjah in 1–3 days, and other emirates in 2–5 days. All orders are shipped free of charge.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "You can request a cancellation or change within 2 hours of placing your order by contacting our support team. Once the order is dispatched, it cannot be modified.",
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is available for orders placed before 12 PM for select Dubai locations. Contact us to confirm availability for your area.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Currently we accept Cash on Delivery (COD) across the UAE. Online card payments and buy-now-pay-later options are coming soon.",
      },
    ],
  },
  {
    category: "Products & Stock",
    items: [
      {
        q: "Are your products brand new and original?",
        a: "Yes. All products sold on QuickCart are 100% brand new, factory sealed, and sourced from authorised distributors. Every product comes with an official manufacturer warranty.",
      },
      {
        q: "What if a product is out of stock?",
        a: "Out-of-stock products display their status on the product page. You can contact us to be notified when the item is back in stock or to enquire about similar alternatives.",
      },
      {
        q: "Do the laptops support UAE power sockets (Type G)?",
        a: "Most laptops include a universal power adapter or come with a UAE-compatible plug. We recommend confirming this in the product specifications or contacting our team.",
      },
      {
        q: "Are the products under UAE warranty?",
        a: "Yes, all products come with manufacturer warranty valid in the UAE. Apple products have warranty serviced at authorised Apple centres across the UAE.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is the return window?",
        a: "We accept returns within 14 days of delivery for defective, damaged, or incorrectly shipped products. See our full Return Policy for details.",
      },
      {
        q: "How long does a refund take?",
        a: "Once we receive and inspect the returned item, refunds are processed within 3–5 business days. The amount is returned to the same payment method used.",
      },
      {
        q: "Who pays for return shipping?",
        a: "We offer free return pickup for eligible returns. Our courier will collect the item from your delivery address at no cost to you.",
      },
    ],
  },
  {
    category: "Account & Orders",
    items: [
      {
        q: "Do I need an account to place an order?",
        a: "Yes, you need to create a free account to place an order. This allows you to track your order, manage returns, and view your order history.",
      },
      {
        q: "How can I track my order?",
        a: "Log in to your account and visit the Orders page. Each order shows its current status. You will also receive SMS and email updates when your order is confirmed and dispatched.",
      },
      {
        q: "Can I have multiple delivery addresses?",
        a: "Yes. You can add multiple delivery addresses to your account and choose the appropriate one at checkout.",
      },
    ],
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#1a1a1a] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className={`text-sm font-medium transition-colors ${open ? "text-blue-400" : "text-white"}`}>{q}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-gray-400 text-sm pb-4 leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-500">Can&apos;t find your answer? <a href="/support/contact" className="text-blue-400 hover:text-blue-300">Contact our support team</a>.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((section) => (
            <div key={section.category} className="bg-[#111111] rounded-xl border border-[#1e1e1e] p-6">
              <h2 className="text-white font-semibold mb-2">{section.category}</h2>
              <div>
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
