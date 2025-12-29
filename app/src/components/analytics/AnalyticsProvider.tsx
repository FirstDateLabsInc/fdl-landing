"use client"

/**
 * Analytics Provider
 * Client component that initializes page view tracking
 *
 * Must be wrapped in Suspense because it uses useSearchParams
 */

import { usePageViews } from "@/hooks/use-page-views"
import { useScrollDepth } from "@/hooks/use-scroll-depth"
import { useSectionTracking } from "@/hooks/use-section-tracking"
import { LANDING_SECTIONS } from "@/lib/analytics"
import { usePathname } from "next/navigation"

// Landing page section IDs to track
const LANDING_SECTION_IDS = Object.values(LANDING_SECTIONS)

/**
 * Analytics Provider component
 * Handles page views, scroll depth, and section tracking
 */
export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  // Always track page views
  usePageViews()

  // Always track scroll depth
  useScrollDepth()

  // Track sections on landing page only
  useSectionTracking({
    sectionIds: isLandingPage ? LANDING_SECTION_IDS : [],
  })

  return children
}
