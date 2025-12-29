/**
 * Analytics Event Functions
 * Type-safe event tracking functions for GA4
 */

import { trackEvent } from "./gtag"
import { EVENTS } from "./constants"
import type {
  PageType,
  DwellBucket,
  ShareMethod,
  DropoutReason,
} from "./types"

// ============================================================================
// PAGE EVENTS
// ============================================================================

/**
 * Track page view (for App Router client navigation)
 */
export function trackPageView(data: {
  pageTitle: string
  pageLocation: string
  pagePath: string
  pageType: PageType
}): void {
  trackEvent(EVENTS.PAGE_VIEW, {
    page_title: data.pageTitle,
    page_location: data.pageLocation,
    page_path: data.pagePath,
    page_type: data.pageType,
  })
}

/**
 * Track scroll depth milestone
 */
export function trackScrollDepth(data: {
  percentScrolled: number
  pageType: PageType
  pagePath: string
}): void {
  trackEvent(EVENTS.SCROLL_DEPTH, {
    percent_scrolled: data.percentScrolled,
    page_type: data.pageType,
    page_path: data.pagePath,
  })
}

// ============================================================================
// SECTION EVENTS
// ============================================================================

/**
 * Track section view (when section is visible for ≥2s)
 */
export function trackSectionView(data: {
  sectionId: string
  pageType: PageType
  pagePath: string
}): void {
  trackEvent(EVENTS.SECTION_VIEW, {
    section_id: data.sectionId,
    page_type: data.pageType,
    page_path: data.pagePath,
  })
}

/**
 * Track section dwell time (when leaving section or on flush, if ≥3s)
 */
export function trackSectionDwell(data: {
  sectionId: string
  dwellMs: number
  dwellBucket: DwellBucket
  pageType: PageType
}): void {
  trackEvent(EVENTS.SECTION_DWELL, {
    section_id: data.sectionId,
    dwell_ms: data.dwellMs,
    dwell_bucket: data.dwellBucket,
    page_type: data.pageType,
  })
}

// ============================================================================
// CTA/BUTTON EVENTS
// ============================================================================

/**
 * Track CTA button click
 */
export function trackCtaClick(data: {
  ctaId: string
  ctaText: string
  ctaLocation: string
  sectionId?: string
  pageType: PageType
}): void {
  trackEvent(EVENTS.CTA_CLICK, {
    cta_id: data.ctaId,
    cta_text: data.ctaText,
    cta_location: data.ctaLocation,
    section_id: data.sectionId,
    page_type: data.pageType,
  })
}

// ============================================================================
// FORM EVENTS
// ============================================================================

/**
 * Track waitlist form start (email field focused)
 * IMPORTANT: Never send PII (email, name, etc.) to GA
 */
export function trackWaitlistStart(formLocation: string): void {
  trackEvent(EVENTS.WAITLIST_START, {
    form_location: formLocation,
  })
}

/**
 * Track successful lead generation (GA4 recommended event)
 * IMPORTANT: Never send PII (email, name, etc.) to GA
 */
export function trackGenerateLead(data: {
  formLocation: string
  hasQuizResult: boolean
  archetypeId?: string
}): void {
  trackEvent(EVENTS.GENERATE_LEAD, {
    form_location: data.formLocation,
    has_quiz_result: data.hasQuizResult,
    archetype_id: data.archetypeId,
  })
}

// ============================================================================
// FAQ EVENTS
// ============================================================================

/**
 * Track FAQ accordion open
 */
export function trackFaqOpen(data: {
  faqId: string
  faqQuestion: string
}): void {
  trackEvent(EVENTS.FAQ_OPEN, {
    faq_id: data.faqId,
    // Truncate question to 100 chars for GA4 limit
    faq_question: data.faqQuestion.slice(0, 100),
  })
}

/**
 * Track FAQ accordion close with time open
 */
export function trackFaqClose(data: {
  faqId: string
  timeOpenMs: number
}): void {
  trackEvent(EVENTS.FAQ_CLOSE, {
    faq_id: data.faqId,
    time_open_ms: data.timeOpenMs,
  })
}

// ============================================================================
// QUIZ FUNNEL EVENTS
// ============================================================================

/**
 * Track quiz start (first answer)
 */
export function trackQuizStart(data: {
  entrySource: string
  quizVersion: string
}): void {
  trackEvent(EVENTS.QUIZ_START, {
    entry_source: data.entrySource,
    quiz_version: data.quizVersion,
  })
}

/**
 * Track quiz step/page view
 */
export function trackQuizStepView(data: {
  stepIndex: number
  totalSteps: number
}): void {
  trackEvent(EVENTS.QUIZ_STEP_VIEW, {
    step_index: data.stepIndex,
    total_steps: data.totalSteps,
  })
}

/**
 * Track quiz step completion
 */
export function trackQuizStepComplete(data: {
  stepIndex: number
  stepTimeMs: number
  answersOnStep: number
}): void {
  trackEvent(EVENTS.QUIZ_STEP_COMPLETE, {
    step_index: data.stepIndex,
    step_time_ms: data.stepTimeMs,
    answers_on_step: data.answersOnStep,
  })
}

/**
 * Track quiz completion
 */
export function trackQuizComplete(data: {
  totalDurationMs: number
  archetypeId: string
  quizVersion: string
}): void {
  trackEvent(EVENTS.QUIZ_COMPLETE, {
    total_duration_ms: data.totalDurationMs,
    archetype_id: data.archetypeId,
    quiz_version: data.quizVersion,
  })
}

/**
 * Track quiz dropout (user leaves before completing)
 */
export function trackQuizDropout(data: {
  lastStepIndex: number
  answeredCount: number
  progressPercent: number
  elapsedMs: number
  timeOnStepMs: number
  reason: DropoutReason
}): void {
  trackEvent(EVENTS.QUIZ_DROPOUT, {
    last_step_index: data.lastStepIndex,
    answered_count: data.answeredCount,
    progress_percent: data.progressPercent,
    elapsed_ms: data.elapsedMs,
    time_on_step_ms: data.timeOnStepMs,
    reason: data.reason,
  })
}

// ============================================================================
// QUIZ RESULTS EVENTS
// ============================================================================

/**
 * Track quiz results page view
 */
export function trackQuizResultsView(data: {
  resultId: string
  archetypeId: string
  viewMode: "owner" | "shared"
}): void {
  trackEvent(EVENTS.QUIZ_RESULTS_VIEW, {
    result_id: data.resultId,
    archetype_id: data.archetypeId,
    view_mode: data.viewMode,
  })
}

/**
 * Track results section view (when visible for ≥2s)
 */
export function trackResultsSectionView(data: {
  sectionId: string
  gated: boolean
  timeSinceLoadMs: number
}): void {
  trackEvent(EVENTS.RESULTS_SECTION_VIEW, {
    section_id: data.sectionId,
    gated: data.gated,
    time_since_load_ms: data.timeSinceLoadMs,
  })
}

/**
 * Track results section dwell time (when leaving section, if ≥3s)
 */
export function trackResultsSectionDwell(data: {
  sectionId: string
  gated: boolean
  dwellMs: number
  dwellBucket: DwellBucket
}): void {
  trackEvent(EVENTS.RESULTS_SECTION_DWELL, {
    section_id: data.sectionId,
    gated: data.gated,
    dwell_ms: data.dwellMs,
    dwell_bucket: data.dwellBucket,
  })
}

/**
 * Track results reading complete (≥80% scroll AND ≥30s active time)
 */
export function trackResultsReadingComplete(data: {
  timeOnResultsMs: number
  sectionsViewedCount: number
  gatedSectionsViewed: number
}): void {
  trackEvent(EVENTS.RESULTS_READING_COMPLETE, {
    time_on_results_ms: data.timeOnResultsMs,
    sections_viewed_count: data.sectionsViewedCount,
    gated_sections_viewed: data.gatedSectionsViewed,
  })
}

/**
 * Track unlock CTA click on gated content
 */
export function trackUnlockClick(data: {
  sectionId: string
  unlockType: string
  archetypeId: string
}): void {
  trackEvent(EVENTS.UNLOCK_CLICK, {
    section_id: data.sectionId,
    unlock_type: data.unlockType,
    archetype_id: data.archetypeId,
  })
}

// ============================================================================
// SHARE EVENTS
// ============================================================================

/**
 * Track share action (GA4 recommended event)
 */
export function trackShare(data: {
  method: ShareMethod
  contentType: string
  archetypeId?: string
}): void {
  trackEvent(EVENTS.SHARE, {
    method: data.method,
    content_type: data.contentType,
    archetype_id: data.archetypeId,
  })
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get dwell bucket from milliseconds
 */
export function getDwellBucket(ms: number): DwellBucket {
  if (ms < 3000) return "0_3s"
  if (ms < 10000) return "3_10s"
  if (ms < 30000) return "10_30s"
  return "30s_plus"
}

/**
 * Get page type from pathname
 */
export function getPageType(pathname: string): PageType {
  if (pathname === "/") return "landing"
  if (pathname === "/quiz") return "quiz_landing"
  if (pathname === "/quiz/questions") return "quiz_questions"
  if (pathname.startsWith("/quiz/results")) return "quiz_results"
  if (pathname === "/contact") return "contact"
  return "other"
}
