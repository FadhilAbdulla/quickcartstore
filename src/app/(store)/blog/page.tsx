import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { buildMetadata, SITE, breadcrumbJsonLd, websiteJsonLd } from "@/lib/seo"
import { Calendar, Tag, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = buildMetadata({
  title: "Tech Blog — Computer & IT Tips for UAE Buyers",
  description:
    "Expert guides on buying laptops, gaming PCs, monitors and networking gear in the UAE. Stay updated with the latest deals, product launches and tech trends in Dubai.",
  path: "/blog",
  keywords: [
    "buy laptop UAE", "best gaming PC Dubai 2025", "IT store Dubai blog",
    "computer deals UAE", "laptop price Dubai", "monitor deals UAE",
    "tech blog UAE", "HP Dell Lenovo UAE review", "gaming accessories Dubai",
    "network equipment UAE", "PC components Dubai guide",
  ],
  type: "website",
})

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" })
}

export default async function BlogListPage() {
  const blogs = await db.blog.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, tags: true, author: true, publishedAt: true,
    },
  })

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Blog", url: `${SITE.url}/blog` },
  ])

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "QuickCart UAE Tech Blog",
    url: `${SITE.url}/blog`,
    description: "Expert guides on buying computers, laptops and IT products in the UAE",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    blogPost: blogs.map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      url: `${SITE.url}/blog/${b.slug}`,
      description: b.excerpt,
      datePublished: b.publishedAt,
      author: { "@type": "Organization", name: b.author },
    })),
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where can I buy laptops in Dubai?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "QuickCart UAE (www.quickcartstore.ae) offers a wide range of laptops from HP, Dell, Lenovo, ASUS and Apple with authentic UAE warranty and fast delivery across Dubai and the UAE.",
        },
      },
      {
        "@type": "Question",
        name: "Which gaming PC is best for UAE buyers in 2025?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ASUS ROG and MSI gaming PCs are top picks for UAE gamers in 2025, available at QuickCart with full UAE warranty and competitive pricing.",
        },
      },
      {
        "@type": "Question",
        name: "Is there free delivery for computers in UAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, QuickCart UAE offers free delivery on orders above AED 200 across Dubai, Abu Dhabi, Sharjah and all other emirates.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <div className="min-h-screen store-content">
        {/* Hero */}
        <section className="py-14 border-b" style={{ background: "linear-gradient(135deg, #072654 0%, #0a3d7a 100%)" }}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 text-blue-200 bg-white/10">
              QuickCart UAE Tech Blog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Computer &amp; IT Buying Guides for UAE
            </h1>
            <p className="text-blue-200 max-w-xl mx-auto text-sm leading-relaxed">
              Expert tips, reviews, and deals on laptops, gaming PCs, monitors and networking gear — written for buyers in Dubai and across the UAE.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-12">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            {blogs.length === 0 ? (
              <p className="text-center text-gray-400 py-20">No posts yet. Check back soon!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((b) => (
                  <article
                    key={b.id}
                    className="group rounded-2xl border border-[#dde6f0] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {b.coverImage ? (
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={b.coverImage}
                          alt={b.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-44 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #072654, #0066BA)" }}>
                        <span className="text-white/30 text-4xl font-bold">QC</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {b.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#e8f0fb", color: "#0066BA" }}>
                            <Tag className="h-2.5 w-2.5 inline mr-0.5" />{t}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-bold text-[#072654] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#0066BA] transition-colors">
                        {b.title}
                      </h2>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">{b.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-gray-400 text-[10px]">
                          <Calendar className="h-3 w-3" />
                          {formatDate(b.publishedAt)}
                        </span>
                        <Link
                          href={`/blog/${b.slug}`}
                          className="flex items-center gap-1 text-xs font-medium transition-colors"
                          style={{ color: "#0066BA" }}
                        >
                          Read more <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
