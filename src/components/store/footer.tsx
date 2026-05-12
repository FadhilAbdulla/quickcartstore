import Link from "next/link"
import { Laptop, MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-[#1e1e1e] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Laptop className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Quick<span className="text-blue-400">Cart</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              UAE&apos;s premier destination for premium laptops. Authentic products, fast delivery, and expert support.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <MapPin className="h-3 w-3 text-blue-500" />
                Dubai, United Arab Emirates
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Mail className="h-3 w-3 text-blue-500" />
                support@quickcart.ae
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Phone className="h-3 w-3 text-blue-500" />
                +971 4 000 0000
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/products", label: "All Laptops" },
                { href: "/products?brand=apple", label: "Apple MacBook" },
                { href: "/products?brand=dell", label: "Dell XPS" },
                { href: "/products?brand=lenovo", label: "Lenovo ThinkPad" },
                { href: "/products?category=gaming", label: "Gaming Laptops" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/auth/signin", label: "Sign In" },
                { href: "/auth/register", label: "Register" },
                { href: "/orders", label: "My Orders" },
                { href: "/account", label: "My Account" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/support/shipping-policy", label: "Shipping Policy" },
                { href: "/support/return-policy", label: "Return Policy" },
                { href: "/support/warranty", label: "Warranty" },
                { href: "/support/contact", label: "Contact Us" },
                { href: "/support/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs" suppressHydrationWarning>
            © {new Date().getFullYear()} QuickCart. All rights reserved. Dubai, UAE.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-xs">We accept:</span>
            <div className="flex gap-2">
              {["VISA", "MC", "AMEX", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="px-2 py-0.5 rounded border border-[#2a2a2a] text-gray-600 text-[10px] font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
