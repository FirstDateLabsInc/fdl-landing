/**
 * Hooks Index
 * Public exports for custom hooks
 */

// Analytics hooks
export { usePageViews, PageViewsProvider } from "./use-page-views"
export { useFlushOnHide, useActiveTimer } from "./use-flush-on-hide"
export { useScrollDepth } from "./use-scroll-depth"
export {
  useSectionTracking,
  useSingleSectionTracking,
} from "./use-section-tracking"
export { useQuizResultsTracking } from "./use-quiz-results-tracking"

// Re-export existing hooks if any
export { useQuiz } from "./use-quiz"
