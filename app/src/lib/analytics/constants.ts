/**
 * Analytics Constants
 * Event names and parameter keys for GA4 tracking
 *
 * GA4 Naming Rules:
 * - Event names: 1-40 chars, start with letter, alphanumeric + underscore only
 * - Parameter names: 1-40 chars, start with letter, alphanumeric + underscore only
 * - Parameter values: max 100 chars (for custom params)
 */

// Event names
export const EVENTS = {
  // Navigation & Engagement
  PAGE_VIEW: "page_view",
  SCROLL_DEPTH: "scroll_depth",

  // Section tracking
  SECTION_VIEW: "section_view",
  SECTION_DWELL: "section_dwell",

  // CTA/Button clicks
  CTA_CLICK: "cta_click",

  // Forms
  WAITLIST_START: "waitlist_start",
  GENERATE_LEAD: "generate_lead", // GA4 recommended event

  // FAQ
  FAQ_OPEN: "faq_open",
  FAQ_CLOSE: "faq_close",

  // Quiz funnel
  QUIZ_START: "quiz_start",
  QUIZ_STEP_VIEW: "quiz_step_view",
  QUIZ_STEP_COMPLETE: "quiz_step_complete",
  QUIZ_COMPLETE: "quiz_complete",
  QUIZ_DROPOUT: "quiz_dropout",

  // Quiz results
  QUIZ_RESULTS_VIEW: "quiz_results_view",
  RESULTS_SECTION_VIEW: "results_section_view",
  RESULTS_SECTION_DWELL: "results_section_dwell",
  RESULTS_READING_COMPLETE: "results_reading_complete",
  UNLOCK_CLICK: "unlock_click",

  // Share
  SHARE: "share", // GA4 recommended event
} as const

// Parameter keys (shared vocabulary)
export const PARAMS = {
  // Page params
  PAGE_TITLE: "page_title",
  PAGE_LOCATION: "page_location",
  PAGE_PATH: "page_path",
  PAGE_TYPE: "page_type",

  // Section params
  SECTION_ID: "section_id",

  // CTA params
  CTA_ID: "cta_id",
  CTA_TEXT: "cta_text",
  CTA_LOCATION: "cta_location",

  // Form params
  FORM_LOCATION: "form_location",
  HAS_QUIZ_RESULT: "has_quiz_result",

  // Quiz params
  ARCHETYPE_ID: "archetype_id",
  RESULT_ID: "result_id",
  QUIZ_VERSION: "quiz_version",
  ENTRY_SOURCE: "entry_source",
  STEP_INDEX: "step_index",
  TOTAL_STEPS: "total_steps",
  STEP_TIME_MS: "step_time_ms",
  ANSWERS_ON_STEP: "answers_on_step",
  TOTAL_DURATION_MS: "total_duration_ms",
  LAST_STEP_INDEX: "last_step_index",
  ANSWERED_COUNT: "answered_count",
  PROGRESS_PERCENT: "progress_percent",
  ELAPSED_MS: "elapsed_ms",
  TIME_ON_STEP_MS: "time_on_step_ms",
  REASON: "reason",

  // Results params
  VIEW_MODE: "view_mode",
  GATED: "gated",
  TIME_SINCE_LOAD_MS: "time_since_load_ms",
  TIME_ON_RESULTS_MS: "time_on_results_ms",
  SECTIONS_VIEWED_COUNT: "sections_viewed_count",
  GATED_SECTIONS_VIEWED: "gated_sections_viewed",
  UNLOCK_TYPE: "unlock_type",

  // Engagement params
  DWELL_MS: "dwell_ms",
  DWELL_BUCKET: "dwell_bucket",
  PERCENT_SCROLLED: "percent_scrolled",
  TIME_OPEN_MS: "time_open_ms",

  // FAQ params
  FAQ_ID: "faq_id",
  FAQ_QUESTION: "faq_question",

  // Share params
  METHOD: "method",
  CONTENT_TYPE: "content_type",
} as const

// GA4 standard params that should NOT be truncated
export const GA4_STANDARD_PARAMS = new Set([
  "page_location",
  "page_referrer",
  "page_title",
  "page_path",
  "screen_name",
  "language",
  "screen_resolution",
  "currency",
  "value",
])

// GA4 limits
export const GA4_LIMITS = {
  EVENT_NAME_MAX_LENGTH: 40,
  PARAM_COUNT_MAX: 25,
  PARAM_VALUE_MAX_LENGTH: 100,
  PARAM_NAME_MAX_LENGTH: 40,
}

// Section IDs for landing page
export const LANDING_SECTIONS = {
  HERO: "hero",
  SOCIAL_PROOF: "social-proof",
  PROBLEM_SOLUTION: "problem-solution",
  BENEFITS: "benefits",
  FAQ: "faq",
  WAITLIST: "waitlist",
} as const

// Section IDs for quiz results
export const RESULTS_SECTIONS = {
  PATTERN: "pattern",
  SCORE_INSIGHTS: "score_insights",
  DATING_MEANING: "dating_meaning",
  RED_FLAGS: "red_flags",
  COACHING: "coaching",
  LOVE_LANGUAGES: "love_languages",
  SHARE_RESULTS: "share_results",
  FULL_PICTURE: "full_picture",
} as const

// Quiz analytics sessionStorage key
export const QUIZ_ANALYTICS_STATE_KEY = "quiz_analytics_state"

// Current quiz version for tracking
export const QUIZ_VERSION = "1.0"
