import type { Metadata } from "next"
import { buildMetadata, SITE } from "@/lib/seo"

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with QuickCart UAE — call, email or use our contact form. Our IT support team is available 7 days a week across Dubai and the UAE.",
  path: "/support/contact",
  keywords: [
    "contact QuickCart",
    "IT store Dubai phone",
    "customer support UAE",
    "QuickCart email",
  ],
})

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "AE",
    availableLanguage: "English",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {children}
    </>
  )
}
