"use client"

/**
 * useSectionTracking Hook
 * Tracks section visibility and dwell time using IntersectionObserver
 *
 * Features:
 * - Tracks section_view when section visible for ≥2s
 * - Tracks section_dwell when leaving section (if ≥3s)
 * - Accumulates dwell time across multiple in/out cycles
 * - Caps reports per section to prevent spam from scroll back-and-forth
 */

import { useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import {
  trackSectionView,
  trackSectionDwell,
  getDwellBucket,
  getPageType,
} from "@/lib/analytics"
import { useFlushOnHide } from "./use-flush-on-hide"

// Minimum time visible before counting as "viewed" (ms)
const MIN_VIEW_MS = 2000

// Minimum dwell time to report (ms)
const MIN_DWELL_MS = 3000

// Maximum reports per section per page view (prevent spam)
const MAX_REPORTS_PER_SECTION = 3

interface SectionState {
  enterTime: number | null
  totalDwell: number
  hasTrackedView: boolean
  reportCount: number
}

interface UseSectionTrackingOptions {
  /** Array of section IDs to track */
  sectionIds: string[]
  /** Intersection threshold (0-1), default 0.5 */
  threshold?: number
}

/**
 * Hook to track section visibility and dwell time
 *
 * @param options - Configuration options
 */
export function useSectionTracking(options: UseSectionTrackingOptions): void {
  const { sectionIds, threshold = 0.5 } = options
  const pathname = usePathname()
  const pageType = getPageType(pathname)

  // Track state for each section
  const sectionStates = useRef<Map<string, SectionState>>(new Map())

  // Track timeout IDs for cleanup (prevents memory leaks on unmount)
  const viewTimeoutIds = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Initialize section states
  useEffect(() => {
    sectionStates.current = new Map(
      sectionIds.map((id) => [
        id,
        {
          enterTime: null,
          totalDwell: 0,
          hasTrackedView: false,
          reportCount: 0,
        },
      ])
    )
  }, [sectionIds])

  // Flush function for when page becomes hidden
  const flushSections = useCallback(() => {
    const now = Date.now()

    sectionStates.current.forEach((state, sectionId) => {
      // Finalize any in-progress view
      if (state.enterTime !== null) {
        const duration = now - state.enterTime
        state.totalDwell += duration
        state.enterTime = null
      }

      // Report final dwell if significant and not already maxed out
      if (
        state.totalDwell >= MIN_DWELL_MS &&
        state.reportCount < MAX_REPORTS_PER_SECTION
      ) {
        trackSectionDwell({
          sectionId,
          dwellMs: state.totalDwell,
          dwellBucket: getDwellBucket(state.totalDwell),
          pageType,
        })
        state.reportCount++
      }
    })
  }, [pageType])

  // Use flush on hide hook
  useFlushOnHide(flushSections)

  // Set up IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    // Capture ref value for cleanup to avoid stale ref warning
    const timeoutIdsMap = viewTimeoutIds.current

    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          const state = sectionStates.current.get(sectionId)
          if (!state) return

          const now = Date.now()

          if (entry.isIntersecting) {
            // Section entered viewport
            state.enterTime = now

            // Clear any existing timeout for this section
            const existingTimeout = viewTimeoutIds.current.get(sectionId)
            if (existingTimeout) {
              clearTimeout(existingTimeout)
            }

            // Schedule view tracking after MIN_VIEW_MS
            const timeoutId = setTimeout(() => {
              viewTimeoutIds.current.delete(sectionId)
              const currentState = sectionStates.current.get(sectionId)
              if (
                currentState &&
                currentState.enterTime !== null &&
                !currentState.hasTrackedView
              ) {
                trackSectionView({
                  sectionId,
                  pageType,
                  pagePath: pathname,
                })
                currentState.hasTrackedView = true
              }
            }, MIN_VIEW_MS)
            viewTimeoutIds.current.set(sectionId, timeoutId)
          } else if (state.enterTime !== null) {
            // Section left viewport
            const duration = now - state.enterTime
            state.totalDwell += duration
            state.enterTime = null

            // Report dwell if significant and not maxed out
            if (
              duration >= MIN_DWELL_MS &&
              state.reportCount < MAX_REPORTS_PER_SECTION
            ) {
              trackSectionDwell({
                sectionId,
                dwellMs: duration,
                dwellBucket: getDwellBucket(duration),
                pageType,
              })
              state.reportCount++
            }
          }
        },
        { threshold }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
      // Clear all pending timeouts to prevent memory leaks
      timeoutIdsMap.forEach((id) => clearTimeout(id))
      timeoutIdsMap.clear()
    }
  }, [sectionIds, threshold, pageType, pathname])
}

/**
 * Simple hook for tracking a single section
 */
export function useSingleSectionTracking(
  sectionId: string,
  threshold = 0.5
): void {
  useSectionTracking({ sectionIds: [sectionId], threshold })
}
