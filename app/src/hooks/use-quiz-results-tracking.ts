"use client"

/**
 * useQuizResultsTracking Hook
 * Specialized tracking for quiz results page engagement
 *
 * Tracks:
 * - Initial results view
 * - Section visibility and dwell time
 * - Reading completion (≥80% scroll AND ≥30s active time)
 * - Exit metrics
 */

import { useEffect, useRef, useCallback } from "react"
import {
  trackQuizResultsView,
  trackResultsSectionView,
  trackResultsSectionDwell,
  trackResultsReadingComplete,
  getDwellBucket,
} from "@/lib/analytics"
import { useFlushOnHide, useActiveTimer } from "./use-flush-on-hide"
import { RESULTS_SECTIONS } from "@/lib/analytics"

// Minimum time visible before counting as "viewed" (ms)
const MIN_VIEW_MS = 2000

// Minimum dwell time to report (ms)
const MIN_DWELL_MS = 3000

// Minimum active time to count as "reading complete" (ms)
const MIN_READING_TIME_MS = 30000

// Scroll threshold for "reading complete" (%)
const READING_COMPLETE_SCROLL_THRESHOLD = 80

interface Section {
  id: string
  gated: boolean
}

interface UseQuizResultsTrackingOptions {
  resultId: string
  archetypeId: string
  viewMode: "owner" | "shared"
  sections?: Section[]
}

interface SectionState {
  enterTime: number | null
  totalDwell: number
  hasTrackedView: boolean
}

// Default sections with gating info
const DEFAULT_SECTIONS: Section[] = [
  { id: RESULTS_SECTIONS.PATTERN, gated: false },
  { id: RESULTS_SECTIONS.SCORE_INSIGHTS, gated: false },
  { id: RESULTS_SECTIONS.DATING_MEANING, gated: true },
  { id: RESULTS_SECTIONS.RED_FLAGS, gated: true },
  { id: RESULTS_SECTIONS.COACHING, gated: false },
  { id: RESULTS_SECTIONS.LOVE_LANGUAGES, gated: false },
  { id: RESULTS_SECTIONS.SHARE_RESULTS, gated: false },
  { id: RESULTS_SECTIONS.FULL_PICTURE, gated: false },
]

/**
 * Hook to track quiz results page engagement
 */
export function useQuizResultsTracking(
  options: UseQuizResultsTrackingOptions
): void {
  const {
    resultId,
    archetypeId,
    viewMode,
    sections = DEFAULT_SECTIONS,
  } = options

  const pageLoadTime = useRef(0)
  const sectionStates = useRef<Map<string, SectionState>>(new Map())
  const viewedSections = useRef<Set<string>>(new Set())
  const maxScrollDepth = useRef(0)
  const hasTrackedReadingComplete = useRef(false)

  // Track timeout IDs for cleanup (prevents memory leaks on unmount)
  const viewTimeoutIds = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const { getActiveTime } = useActiveTimer()

  // Initialize pageLoadTime in effect to comply with React Compiler rules
  useEffect(() => {
    pageLoadTime.current = Date.now()
  }, [])

  // Track initial page view
  useEffect(() => {
    trackQuizResultsView({
      resultId,
      archetypeId,
      viewMode,
    })
  }, [resultId, archetypeId, viewMode])

  // Initialize section states
  useEffect(() => {
    sectionStates.current = new Map(
      sections.map((section) => [
        section.id,
        {
          enterTime: null,
          totalDwell: 0,
          hasTrackedView: false,
        },
      ])
    )
  }, [sections])

  // Check reading complete conditions
  const checkReadingComplete = useCallback(() => {
    if (hasTrackedReadingComplete.current) return

    const activeTime = getActiveTime()
    const hasEnoughTime = activeTime >= MIN_READING_TIME_MS
    const hasEnoughScroll = maxScrollDepth.current >= READING_COMPLETE_SCROLL_THRESHOLD

    if (hasEnoughTime && hasEnoughScroll) {
      hasTrackedReadingComplete.current = true

      const gatedSectionsViewed = sections.filter(
        (s) => s.gated && viewedSections.current.has(s.id)
      ).length

      trackResultsReadingComplete({
        timeOnResultsMs: activeTime,
        sectionsViewedCount: viewedSections.current.size,
        gatedSectionsViewed,
      })
    }
  }, [getActiveTime, sections])

  // Flush function for when page becomes hidden
  const flushSections = useCallback(() => {
    const now = Date.now()

    sectionStates.current.forEach((state, sectionId) => {
      // Finalize any in-progress view
      if (state.enterTime !== null) {
        const duration = now - state.enterTime
        state.totalDwell += duration

        const section = sections.find((s) => s.id === sectionId)
        if (section && state.totalDwell >= MIN_DWELL_MS) {
          trackResultsSectionDwell({
            sectionId,
            gated: section.gated,
            dwellMs: state.totalDwell,
            dwellBucket: getDwellBucket(state.totalDwell),
          })
        }
        state.enterTime = null
      }
    })

    // Final reading complete check
    checkReadingComplete()
  }, [sections, checkReadingComplete])

  // Use flush on hide hook
  useFlushOnHide(flushSections)

  // Track scroll depth
  useEffect(() => {
    const calculateScrollPercent = (): number => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return 100
      return Math.round((window.scrollY / scrollHeight) * 100)
    }

    const handleScroll = (): void => {
      const scrollPercent = calculateScrollPercent()

      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent
        checkReadingComplete()
      }
    }

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
    return () => window.removeEventListener("scroll", throttledHandler)
  }, [checkReadingComplete])

  // Set up IntersectionObserver for sections
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    // Capture ref value for cleanup to avoid stale ref warning
    const timeoutIdsMap = viewTimeoutIds.current

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          const state = sectionStates.current.get(section.id)
          if (!state) return

          const now = Date.now()

          if (entry.isIntersecting) {
            // Section entered viewport
            state.enterTime = now

            // Clear any existing timeout for this section
            const existingTimeout = viewTimeoutIds.current.get(section.id)
            if (existingTimeout) {
              clearTimeout(existingTimeout)
            }

            // Track section view after MIN_VIEW_MS
            const timeoutId = setTimeout(() => {
              viewTimeoutIds.current.delete(section.id)
              const currentState = sectionStates.current.get(section.id)
              if (
                currentState &&
                currentState.enterTime !== null &&
                !currentState.hasTrackedView
              ) {
                viewedSections.current.add(section.id)
                trackResultsSectionView({
                  sectionId: section.id,
                  gated: section.gated,
                  timeSinceLoadMs: now - pageLoadTime.current,
                })
                currentState.hasTrackedView = true
              }
            }, MIN_VIEW_MS)
            viewTimeoutIds.current.set(section.id, timeoutId)
          } else if (state.enterTime !== null) {
            // Section left viewport
            const duration = now - state.enterTime
            state.totalDwell += duration

            // Report dwell if significant
            if (duration >= MIN_DWELL_MS) {
              trackResultsSectionDwell({
                sectionId: section.id,
                gated: section.gated,
                dwellMs: duration,
                dwellBucket: getDwellBucket(duration),
              })
            }
            state.enterTime = null
          }
        },
        { threshold: 0.5 }
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
  }, [sections])
}
