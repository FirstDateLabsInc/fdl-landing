"use client"

/**
 * useFlushOnHide Hook
 * Reliable data capture using visibilitychange + pagehide
 *
 * IMPORTANT: Don't use beforeunload/unload - they're unreliable on mobile
 * and can harm bfcache. This pattern is recommended by MDN.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
 */

import { useEffect, useRef } from "react"

/**
 * Hook to flush analytics data when page becomes hidden
 *
 * @param flushFn - Function to call when page becomes hidden
 */
export function useFlushOnHide(flushFn: () => void): void {
  const flushRef = useRef(flushFn)

  // Update ref in effect to comply with React Compiler rules
  useEffect(() => {
    flushRef.current = flushFn
  }, [flushFn])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushRef.current()
      }
    }

    const handlePageHide = () => {
      flushRef.current()
    }

    // visibilitychange fires when:
    // - User switches to another tab
    // - User minimizes browser
    // - Screen turns off (mobile)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // pagehide fires when:
    // - User navigates away
    // - User closes tab/window
    // More reliable than unload for mobile
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [])
}

/**
 * Hook to track active time (pauses when page is hidden)
 *
 * @returns Object with getActiveTime function
 */
export function useActiveTimer(): { getActiveTime: () => number } {
  const activeTimeRef = useRef(0)
  const lastActiveRef = useRef(0)
  const isActiveRef = useRef(true)

  // Initialize lastActiveRef in effect to comply with React Compiler rules
  useEffect(() => {
    lastActiveRef.current = Date.now()
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Pause: accumulate time so far
        activeTimeRef.current += Date.now() - lastActiveRef.current
        isActiveRef.current = false
      } else {
        // Resume: reset last active timestamp
        lastActiveRef.current = Date.now()
        isActiveRef.current = true
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const getActiveTime = (): number => {
    if (isActiveRef.current) {
      return activeTimeRef.current + (Date.now() - lastActiveRef.current)
    }
    return activeTimeRef.current
  }

  return { getActiveTime }
}
