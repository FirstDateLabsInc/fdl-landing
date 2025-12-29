"use client"

/**
 * useScrollDepth Hook
 * Tracks scroll depth milestones (25%, 50%, 75%, 90%)
 *
 * NOTE: If using this, disable GA4 Enhanced Measurement scroll
 * to avoid double-counting (default only tracks 90% once)
 */

import { useEffect, useRef } from "react"
import { trackScrollDepth, getPageType } from "@/lib/analytics"
import { usePathname } from "next/navigation"

// Scroll milestones to track
const SCROLL_MILESTONES = [25, 50, 75, 90] as const

/**
 * Hook to track scroll depth milestones
 *
 * @returns Object with getMaxScrollDepth function
 */
export function useScrollDepth(): { getMaxScrollDepth: () => number } {
  const pathname = usePathname()
  const trackedMilestones = useRef<Set<number>>(new Set())
  const maxScrollDepth = useRef(0)

  useEffect(() => {
    // Reset on route change
    trackedMilestones.current = new Set()
    maxScrollDepth.current = 0

    const calculateScrollPercent = (): number => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return 100
      return Math.round((window.scrollY / scrollHeight) * 100)
    }

    const handleScroll = (): void => {
      const scrollPercent = calculateScrollPercent()

      // Update max depth
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent
      }

      // Track milestones
      for (const milestone of SCROLL_MILESTONES) {
        if (
          scrollPercent >= milestone &&
          !trackedMilestones.current.has(milestone)
        ) {
          trackedMilestones.current.add(milestone)
          trackScrollDepth({
            percentScrolled: milestone,
            pageType: getPageType(pathname),
            pagePath: pathname,
          })
        }
      }
    }

    // Throttle scroll handler using requestAnimationFrame
    let ticking = false
    const throttledHandler = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledHandler, { passive: true })

    // Check initial scroll position (user might have scrolled before JS loaded)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", throttledHandler)
    }
  }, [pathname])

  return { getMaxScrollDepth: () => maxScrollDepth.current }
}
