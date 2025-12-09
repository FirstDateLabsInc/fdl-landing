/**
 * Shared API Types
 *
 * Common patterns used across all Worker endpoints.
 * These types define reusable contracts for tracking, errors, and base responses.
 */

// ============================================================================
// TRACKING & ATTRIBUTION
// ============================================================================

/** Attribution & Analytics - reused in quiz and waitlist */
export interface TrackingParams {
  /** Traffic source identifier (e.g., 'web', 'app', 'partner') */
  source?: string;
  /** UTM source parameter */
  utmSource?: string;
  /** UTM medium parameter */
  utmMedium?: string;
  /** UTM campaign parameter */
  utmCampaign?: string;
}

// ============================================================================
// ERROR CODES
// ============================================================================

/** Error codes that can appear in any endpoint */
export type CommonErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVER_ERROR";
