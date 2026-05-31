import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo"
import { Shield, Truck, Headphones, Award, MapPin, Mail, Phone, Monitor } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = buildMetadata({
  title: "About QuickCart UAE",
  description:
    "QuickCart is Dubai's premier IT products store — 5,000+ authentic products, UAE warranty, and fast delivery across Dubai, Abu Dhabi, Sharjah and all emirates.",
  path: "/about",
  keywords: [
    "about QuickCart",
    "IT store Dubai",
    "computer shop UAE",
    "authorized reseller Dubai",
    "UAE warranty IT products",
  ],
})

const stats = [
  { value: "5,000+", label: "IT Products" },
  { value: "50K+", label: "Happy Customers" },
  { value: "10+", label: "Years Experience" },
  { value: "100%", label: "Authentic Products" },
]

const values = [
  {
    icon: Shield,
    title: "Authentic Products",
    desc: "Every product we sell is 100% genuine, sourced directly from authorized distributors and brand representatives across the UAE.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Truck,
    title: "Fast UAE Delivery",
    desc: "Same-day delivery in Dubai and next-day delivery across the UAE. We know your business can't wait.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Our team of certified IT specialists is available 7 days a week to help you find the right product for your needs.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    desc: "Found it cheaper elsewhere? We'll match or beat any verified price. Your satisfaction is our commitment.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-purple-950/20 pointer-events-none" />
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <Monitor className="h-5 w-5 text-[#ffffff]" />
              </div>
              <span className="font-bold text-white text-2xl tracking-tight">
                Quick<span className="text-blue-400">Cart</span>
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              UAE&apos;s Premier
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                IT Products Store
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Founded with a mission to bring the best IT products to businesses and individuals across the UAE, QuickCart has grown to become the region&apos;s most trusted technology retailer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/support/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-[#1a1a1a] py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 rounded-2xl border border-[#1e1e1e] bg-[#111111]">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-[#1a1a1a] py-14 bg-[#080808]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
            <p className="text-gray-400 text-base leading-relaxed mb-4">
              QuickCart was established in Dubai with a clear vision: to make premium IT products accessible to every business and individual in the UAE. We recognized that the market needed a one-stop destination that combined competitive pricing, genuine products, and exceptional service.
            </p>
            <p className="text-gray-400 text-base leading-relaxed">
              Today, we stock over 5,000 IT products — from laptops and workstations to networking equipment and peripherals — all backed by UAE warranty and our price-match guarantee. We&apos;re proud to serve tens of thousands of satisfied customers across Dubai, Abu Dhabi, Sharjah, and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-[#1a1a1a] py-14">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Why Choose QuickCart</h2>
          <p className="text-gray-500 text-center mb-10">Built on trust, speed, and expertise</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="p-6 rounded-2xl border border-[#1e1e1e] bg-[#111111] hover:border-[#2a2a2a] transition-colors">
                <div className={`h-10 w-10 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <v.icon className={`h-5 w-5 ${v.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-[#1a1a1a] py-14 bg-[#080808]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-gray-500 mb-8">Have questions? Our team is here to help.</p>
            <div className="space-y-3 text-left max-w-xs mx-auto mb-8">
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                Dubai, United Arab Emirates
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                support@quickcart.ae
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                +971 4 000 0000
              </div>
            </div>
            <Button asChild size="lg">
              <Link href="/support/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
