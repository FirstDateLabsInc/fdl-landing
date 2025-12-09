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
  | "ALREADY_EXISTS";

// ============================================================================
// WAITLIST SIGNUP
// ============================================================================

/** Request to join the email waitlist */
export interface JoinWaitlistRequest extends TrackingParams {
  /** Email address to add to waitlist */
  email: string;
}

/** Response from waitlist signup */
export interface JoinWaitlistResponse {
  /** Whether signup succeeded */
  success: boolean;
  /** Error message if signup failed */
  error?: string;
  /** Structured error code for client handling */
  errorCode?: WaitlistErrorCode;
}
