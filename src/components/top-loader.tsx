"use client"

// eslint-disable-next-line @typescript-eslint/no-require-imports
const NProgress = require("nprogress")
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

interface TopLoaderProps {
  color: string
  height?: number
}

export function TopLoader({ color, height = 2 }: TopLoaderProps) {
  const pathname = usePathname()
  const started = useRef(false)

  // End the bar when the new page renders (pathname has changed)
  useEffect(() => {
    if (started.current) {
      NProgress.done()
      started.current = false
    }
  }, [pathname])

  // Configure NProgress and wire up click → start
  useEffect(() => {
    NProgress.configure({ showSpinner: false, trickle: true, trickleSpeed: 200, minimum: 0.08, easing: "ease", speed: 200 })

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a")
      if (!anchor?.href || anchor.target === "_blank") return
      try {
        const dest = new URL(anchor.href, window.location.href)
        if (dest.origin !== window.location.origin) return
        if (dest.pathname + dest.search === window.location.pathname + window.location.search) return
        NProgress.start()
        started.current = true
      } catch {}
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <style>{`
      #nprogress { pointer-events: none; }
      #nprogress .bar {
        background: ${color};
        position: fixed;
        z-index: 1600;
        top: 0; left: 0;
        width: 100%;
        height: ${height}px;
        box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0;
        width: 100px;
        height: 100%;
        opacity: 1;
        transform: rotate(3deg) translate(0, -4px);
      }
    `}</style>
  )
}
