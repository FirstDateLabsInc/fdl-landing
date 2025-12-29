"use client"

/**
 * usePageViews Hook
 * Tracks page views for Next.js App Router client-side navigation
 *
 * Required because GA4 doesn't auto-track client-side route changes.
 * Works with `send_page_view: false` in gtag config.
 */

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { trackPageView, getPageType } from "@/lib/analytics"

/**
 * Hook to track page views on route changes
 * Should be used in a client component that wraps the app
 */
export function usePageViews(): void {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view with GA4 standard params
    trackPageView({
      pageTitle: document.title,
      pageLocation: window.location.href,
      pagePath: pathname,
      pageType: getPageType(pathname),
    })
  }, [pathname, searchParams])
}

/**
 * Provider component for page view tracking
 * Add this to your layout.tsx inside a Suspense boundary
 */
export function PageViewsProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  usePageViews()
  return children
}
