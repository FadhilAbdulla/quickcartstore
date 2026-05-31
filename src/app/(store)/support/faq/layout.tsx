import type { Metadata } from "next"
import { buildMetadata, faqJsonLd } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Frequently Asked Questions",
  description:
    "Answers to the most common questions about ordering, delivery, returns, products and warranty at QuickCart UAE. Free UAE delivery on all orders.",
  path: "/support/faq",
  keywords: [
    "QuickCart FAQ",
    "IT store questions UAE",
    "delivery questions Dubai",
    "return policy FAQ UAE",
  ],
})

const faqItems = [
  {
    question: "How long does delivery take?",
    answer:
      "Dubai orders typically arrive in 1–2 days, Abu Dhabi and Sharjah in 1–3 days, and other emirates in 2–5 days. All orders are shipped free of charge.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "You can request a cancellation or change within 2 hours of placing your order by contacting our support team. Once the order is dispatched, it cannot be modified.",
  },
  {
    question: "Are your products brand new and original?",
    answer:
      "Yes. All products sold on QuickCart are 100% brand new, factory sealed, and sourced from authorised distributors. Every product comes with an official manufacturer warranty.",
  },
  {
    question: "What is the return window?",
    answer:
      "We accept returns within 14 days of delivery for defective, damaged, or incorrectly shipped products.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "Once we receive and inspect the returned item, refunds are processed within 3–5 business days to the same payment method used.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "Yes, you need to create a free account to place an order. This allows you to track your order, manage returns, and view your order history.",
  },
  {
    question: "Are the products under UAE warranty?",
    answer:
      "Yes, all products come with manufacturer warranty valid in the UAE. Apple products have warranty serviced at authorised Apple centres across the UAE.",
  },
  {
    question: "Do you offer same-day delivery?",
    answer:
      "Same-day delivery is available for orders placed before 12 PM for select Dubai locations. Contact us to confirm availability for your area.",
  },
]

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
      />
      {children}
    </>
  )
}
