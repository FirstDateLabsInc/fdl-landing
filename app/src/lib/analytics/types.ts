/**
 * Analytics Types
 * TypeScript interfaces for GA4 event tracking
 */

// GA4 gtag function type
declare global {
  interface Window {
    gtag: Gtag.Gtag
    dataLayer: unknown[]
  }
}

// Page types for categorization
export type PageType =
  | "landing"
  | "quiz_landing"
  | "quiz_questions"
  | "quiz_results"
  | "contact"
  | "other"

// Dwell time buckets for section engagement
export type DwellBucket = "0_3s" | "3_10s" | "10_30s" | "30s_plus"

// Share methods
export type ShareMethod = "copy_link" | "twitter" | "tiktok" | "instagram" | "native"

// Quiz dropout reasons
export type DropoutReason = "tab_hidden" | "route_change" | "page_close"

// Event parameter types
export interface PageViewParams {
  page_title: string
  page_location: string
  page_path: string
  page_type: PageType
}

export interface ScrollDepthParams {
  percent_scrolled: number
  page_type: PageType
  page_path: string
}

export interface SectionViewParams {
  section_id: string
  page_type: PageType
  page_path: string
}

export interface SectionDwellParams {
  section_id: string
  dwell_ms: number
  dwell_bucket: DwellBucket
  page_type: PageType
}

export interface CtaClickParams {
  cta_id: string
  cta_text: string
  cta_location: string
  section_id?: string
  page_type: PageType
}

export interface WaitlistStartParams {
  form_location: string
}

export interface GenerateLeadParams {
  form_location: string
  has_quiz_result: boolean
  archetype_id?: string
}

export interface FaqOpenParams {
  faq_id: string
  faq_question: string
}

export interface FaqCloseParams {
  faq_id: string
  time_open_ms: number
}

export interface QuizStartParams {
  entry_source: string
  quiz_version: string
}

export interface QuizStepViewParams {
  step_index: number
  total_steps: number
}

export interface QuizStepCompleteParams {
  step_index: number
  step_time_ms: number
  answers_on_step: number
}

export interface QuizCompleteParams {
  total_duration_ms: number
  archetype_id: string
  quiz_version: string
}

export interface QuizDropoutParams {
  last_step_index: number
  answered_count: number
  progress_percent: number
  elapsed_ms: number
  time_on_step_ms: number
  reason: DropoutReason
}

export interface QuizResultsViewParams {
  result_id: string
  archetype_id: string
  view_mode: "owner" | "shared"
}

export interface ResultsSectionViewParams {
  section_id: string
  gated: boolean
  time_since_load_ms: number
}

export interface ResultsSectionDwellParams {
  section_id: string
  gated: boolean
  dwell_ms: number
  dwell_bucket: DwellBucket
}

export interface ResultsReadingCompleteParams {
  time_on_results_ms: number
  sections_viewed_count: number
  gated_sections_viewed: number
}

export interface UnlockClickParams {
  section_id: string
  unlock_type: string
  archetype_id: string
}

export interface ShareParams {
  method: ShareMethod
  content_type: string
  archetype_id?: string
}

// Quiz analytics state for sessionStorage
export interface QuizAnalyticsState {
  startedAt: number
  currentStep: number
  answeredCount: number
  stepTimestamps: number[]
  stepEnterTime: number
}
