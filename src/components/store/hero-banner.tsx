"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  ctaText: string | null
  ctaLink: string | null
  image: string | null
  bgFrom: string
  bgTo: string
  isActive: boolean
}

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const active = banners.filter((b) => b.isActive)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent((c) => (c + 1) % active.length), [active.length])
  const prev = () => setCurrent((c) => (c - 1 + active.length) % active.length)

  useEffect(() => {
    if (active.length <= 1 || paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [active.length, paused, next])

  if (active.length === 0) return null

  const banner = active[current]

  return (
    <section
      className="relative overflow-hidden min-h-[260px] sm:min-h-[340px] md:min-h-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{ background: `linear-gradient(135deg, ${banner.bgFrom} 0%, ${banner.bgTo} 100%)` }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#0066BA" }} />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "#0066BA" }} />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className={`grid gap-8 items-center ${banner.image ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

          {/* Text */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
              {banner.title}
            </h1>
            {banner.subtitle && (
              <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl opacity-90">
                {banner.subtitle}
              </p>
            )}
            {banner.ctaLink && banner.ctaText && (
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-7 text-base text-white font-semibold shadow-lg"
                  style={{ backgroundColor: "#0066BA" }}
                >
                  <Link href={banner.ctaLink}>{banner.ctaText}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Banner image */}
          {banner.image && (
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative w-full max-w-lg aspect-video">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority={current === 0}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation arrows */}
      {active.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label="Next banner"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {active.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {active.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                backgroundColor: i === current ? "#ffffff" : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Go to banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
