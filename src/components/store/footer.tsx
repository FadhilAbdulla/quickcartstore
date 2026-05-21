import Link from "next/link"
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#072654" }} className="border-t border-[#05193d]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/logo-white.svg"
                alt="QuickCart UAE"
                width={160}
                height={30}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed">
              UAE&apos;s premier destination for IT products. Laptops, monitors, networking, components and more — authentic, fast delivery.
            </p>
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-300 text-xs">
                <MapPin className="h-3 w-3 shrink-0" style={{ color: "#0066BA" }} />
                Dubai, United Arab Emirates
              </div>
              <div className="flex items-center gap-2 text-blue-300 text-xs">
                <Mail className="h-3 w-3 shrink-0" style={{ color: "#0066BA" }} />
                support@quickcart.ae
              </div>
              <div className="flex items-center gap-2 text-blue-300 text-xs">
                <Phone className="h-3 w-3 shrink-0" style={{ color: "#0066BA" }} />
                +971 4 000 0000
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/products?category=laptops", label: "Laptops" },
                { href: "/products?category=gaming", label: "Gaming" },
                { href: "/products?category=monitors", label: "Monitors" },
                { href: "/products?category=networking", label: "Networking" },
                { href: "/products?category=pc-components", label: "PC Components" },
                { href: "/products?category=peripherals", label: "Peripherals" },
                { href: "/products?category=storage", label: "Storage" },
                { href: "/products?category=printers", label: "Printers" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-300 text-sm hover:text-white transition-colors">
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
                { href: "/products?featured=true", label: "🏷️ Deals" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-blue-300 text-sm hover:text-white transition-colors">
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
                { href: "/about", label: "About Us" },
                { href: "/support/contact", label: "Contact Us" },
                { href: "/support/shipping-policy", label: "Shipping Policy" },
                { href: "/support/return-policy", label: "Return Policy" },
                { href: "/support/warranty", label: "Warranty" },
                { href: "/support/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-blue-300 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-400 text-xs" suppressHydrationWarning>
            © {new Date().getFullYear()} QuickCart. All rights reserved. Dubai, UAE.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-blue-400 text-xs">We accept:</span>
            <div className="flex gap-2">
              {["VISA", "MC", "AMEX", "Apple Pay"].map((method) => (
                <span
                  key={method}
                  className="px-2 py-0.5 rounded border border-white/20 text-blue-300 text-[10px] font-medium"
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
