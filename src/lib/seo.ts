import type { Metadata } from "next"

export const SITE = {
  url: "https://quickcart.ae",
  name: "QuickCart UAE",
  locale: "en_AE",
  description:
    "Shop laptops, desktops, gaming PCs, monitors, networking, PC components, printers, storage and more. Authentic products with UAE warranty. Fast delivery across Dubai and UAE.",
  ogImage: "/og-image.png",
  themeColor: "#0066BA",
  phone: "+971 4 000 0000",
  email: "support@quickcart.ae",
  address: "Dubai, United Arab Emirates",
}

interface BuildMetadataOptions {
  title: string
  description?: string
  path?: string
  images?: { url: string; alt?: string; width?: number; height?: number }[]
  keywords?: string[]
  noindex?: boolean
  type?: "website" | "article"
}

export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  images,
  keywords,
  noindex = false,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const canonical = `${SITE.url}${path}`
  const ogImages = images ?? [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }]

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type,
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description,
      url: canonical,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  }
}

// ── JSON-LD builders ────────────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    sameAs: [],
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }
}
