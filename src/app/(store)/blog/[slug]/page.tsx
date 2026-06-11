import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { buildMetadata, SITE, breadcrumbJsonLd } from "@/lib/seo"
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" })
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const blog = await db.blog.findUnique({ where: { slug, isPublished: true } })
  if (!blog) return {}

  return buildMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blog/${blog.slug}`,
    keywords: blog.tags,
    type: "article",
    images: blog.coverImage
      ? [{ url: blog.coverImage, width: 1200, height: 630, alt: blog.title }]
      : undefined,
  })
}

function renderMarkdown(md: string) {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#072654] mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-[#072654] mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-[#072654] mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#0066BA]">$1</code>')
    .replace(/^\s*[-*] (.+)$/gm, '<li class="ml-4 list-disc text-gray-700">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="space-y-1 my-4">$&</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-gray-700">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed my-4">')
    .replace(/^(?!<[hul])/gm, '')
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const blog = await db.blog.findUnique({ where: { slug, isPublished: true } })
  if (!blog) notFound()

  const related = await db.blog.findMany({
    where: { isPublished: true, NOT: { id: blog.id }, tags: { hasSome: blog.tags } },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: { title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, tags: true },
  })

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Blog", url: `${SITE.url}/blog` },
    { name: blog.title, url: `${SITE.url}/blog/${blog.slug}` },
  ])

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    url: `${SITE.url}/blog/${blog.slug}`,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Organization",
      name: blog.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/logo.svg` },
    },
    ...(blog.coverImage ? { image: [blog.coverImage] } : {}),
    keywords: blog.tags.join(", "),
    inLanguage: "en-AE",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${blog.slug}` },
  }

  // GEO / AEO — SpecialAnnouncement for UAE-local context
  const geoJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: blog.title,
    url: `${SITE.url}/blog/${blog.slug}`,
    about: {
      "@type": "Thing",
      name: "Computer Products UAE",
      description: "Laptops, gaming PCs, monitors and IT accessories available in the UAE",
    },
    audience: {
      "@type": "Audience",
      geographicArea: { "@type": "Country", name: "United Arab Emirates" },
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".blog-excerpt"],
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(geoJsonLd) }} />

      <div className="min-h-screen store-content">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#0066BA] hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> All Posts
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {blog.tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#e8f0fb", color: "#0066BA" }}>
                <Tag className="h-3 w-3 inline mr-1" />{t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#072654] leading-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-gray-400 text-xs mb-6 pb-6 border-b border-[#dde6f0]">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(blog.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{blog.author}</span>
          </div>

          {/* Excerpt (speakable AEO target) */}
          <p className="blog-excerpt text-base text-gray-600 font-medium leading-relaxed mb-6 p-4 rounded-xl bg-[#f0f5ff] border border-[#dde6f0]">
            {blog.excerpt}
          </p>

          {/* Cover image */}
          {blog.coverImage && (
            <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
              <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: `<p class="text-gray-700 leading-relaxed my-4">${renderMarkdown(blog.content)}</p>`,
            }}
          />

          {/* CTA */}
          <div className="mt-12 p-6 rounded-2xl text-white text-center" style={{ background: "linear-gradient(135deg, #072654, #0066BA)" }}>
            <p className="font-bold text-lg mb-1">Shop IT Products in UAE</p>
            <p className="text-blue-200 text-sm mb-4">Authentic products · UAE warranty · Fast delivery</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-white transition-opacity hover:opacity-90"
              style={{ color: "#072654" }}
            >
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t border-[#dde6f0] py-12">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-bold text-[#072654] mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group block rounded-xl border border-[#dde6f0] bg-white overflow-hidden hover:shadow-md transition-shadow">
                    {r.coverImage ? (
                      <div className="relative h-36 overflow-hidden">
                        <Image src={r.coverImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="h-36 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #072654, #0066BA)" }}>
                        <span className="text-white/30 text-3xl font-bold">QC</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-[#072654] text-sm line-clamp-2 group-hover:text-[#0066BA] transition-colors">{r.title}</h3>
                      <p className="text-gray-400 text-xs mt-1">{formatDate(r.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
