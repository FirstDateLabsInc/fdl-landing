/**
 * Waitlist API Types
 *
 * Request/response contracts for email waitlist endpoints.
 * These types define the interface between the Next.js frontend and
 * Cloudflare Worker backend.
 */

import type { TrackingParams, CommonErrorCode } from "../shared";

// ============================================================================
// ERROR CODES
// ============================================================================

/** Waitlist-specific error codes */
export type WaitlistErrorCode =
  | CommonErrorCode
  | "INVALID_EMAIL"
  | "ALREADY_EXISTS"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

// ============================================================================
// WAITLIST SIGNUP
// ============================================================================

/** Request to join the email waitlist */
export interface JoinWaitlistRequest extends TrackingParams {
  /** Email address to add to waitlist */
  email: string;
  /** Optional quiz result ID for attribution */
  quizResultId?: string;
  /** Archetype name for quiz-specific email (e.g., "The Romantic Idealist") */
  archetypeName?: string;
  /** Archetype emoji for quiz-specific email */
  archetypeEmoji?: string;
}

/** Response from waitlist signup */
export interface JoinWaitlistResponse {
  /** Whether signup succeeded */
  success: boolean;
  /** Waitlist entry ID (UUID) */
  id?: string;
  /** Whether this is a new signup vs reactivation */
  isNew?: boolean;
  /** Unsubscribe token for immediate welcome emails */
  unsubscribeToken?: string;
  /** Error message if signup failed */
  error?: string;
  /** Structured error code for client handling */
  errorCode?: WaitlistErrorCode;
}
