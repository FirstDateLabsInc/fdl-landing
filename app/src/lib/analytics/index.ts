/**
 * Analytics Module
 * Public API exports for GA4 event tracking
 */

// Core functions
export { trackEvent, updateConsent, setUserProperties } from "./gtag"

// Event functions
export {
  // Page events
  trackPageView,
  trackScrollDepth,
  // Section events
  trackSectionView,
  trackSectionDwell,
  // CTA events
  trackCtaClick,
  // Form events
  trackWaitlistStart,
  trackGenerateLead,
  // FAQ events
  trackFaqOpen,
  trackFaqClose,
  // Quiz funnel events
  trackQuizStart,
  trackQuizStepView,
  trackQuizStepComplete,
  trackQuizComplete,
  trackQuizDropout,
  // Quiz results events
  trackQuizResultsView,
  trackResultsSectionView,
  trackResultsSectionDwell,
  trackResultsReadingComplete,
  trackUnlockClick,
  // Share events
  trackShare,
  // Utilities
  getDwellBucket,
  getPageType,
} from "./events"

// Constants
export {
  EVENTS,
  PARAMS,
  GA4_LIMITS,
  LANDING_SECTIONS,
  RESULTS_SECTIONS,
  QUIZ_ANALYTICS_STATE_KEY,
  QUIZ_VERSION,
} from "./constants"

// Types
export type {
  PageType,
  DwellBucket,
  ShareMethod,
  DropoutReason,
  QuizAnalyticsState,
} from "./types"
