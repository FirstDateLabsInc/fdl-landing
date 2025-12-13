/**
 * Quiz API Types
 *
 * Request/response contracts for quiz submission and retrieval APIs.
 * These types define the interface between the Next.js frontend and
 * Cloudflare Worker backend.
 */

import type { TrackingParams, CommonErrorCode } from "../shared";
import type { DBAnswerMap, DBScores } from "@/lib/quiz";

// ============================================================================
// ERROR CODES
// ============================================================================

/** Quiz-specific error codes */
export type QuizErrorCode =
  | CommonErrorCode
  | "INVALID_SESSION"
  | "SESSION_EXPIRED"
  | "FINGERPRINT_MISMATCH"
  | "DUPLICATE_SUBMISSION"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/** Request to create or resume a quiz session */
export interface CreateSessionRequest {
  /** Client fingerprint hash for session binding */
  fingerprintHash: string;
  /** Optional existing session ID to resume */
  existingSessionId?: string;
}

/** Response from session creation */
export interface CreateSessionResponse {
  /** Newly created or resumed session ID */
  sessionId: string;
}

// ============================================================================
// QUIZ SUBMISSION
// ============================================================================

/** Request to submit completed quiz results */
export interface SubmitQuizRequest extends TrackingParams {
  /** Session ID from CreateSessionResponse */
  sessionId: string;
  /** Client fingerprint hash (must match session) */
  fingerprintHash: string;
  /** Raw answers for server-side scoring */
  answers: DBAnswerMap;
  /** Optional: user email for results delivery */
  email?: string;
  /** Optional: quiz duration in seconds */
  durationSeconds?: number;
}

/** Response from quiz submission */
export interface SubmitQuizResponse {
  /** Whether submission succeeded */
  success: boolean;
  /** Unique result ID for retrieval */
  resultId?: string;
  /** Archetype slug computed on the server */
  archetypeSlug?: string;
  /** Server-computed scores (return to avoid an extra fetch) */
  scores?: DBScores;
  /** Optional confidence signal (0-1, lower = blended profile) */
  confidence?: number;
  /** Optional flag when both axes are nearly uniform */
  isBalanced?: boolean;
  /** Error message if submission failed */
  error?: string;
  /** Structured error code for client handling */
  errorCode?: QuizErrorCode;
}

// ============================================================================
// RESULT RETRIEVAL
// ============================================================================

/** Request to retrieve quiz results */
export interface GetResultRequest {
  /** Result ID from SubmitQuizResponse */
  resultId: string;
  /** Optional: session ID for ownership verification */
  sessionId?: string;
}

/** Response containing quiz results */
export interface GetResultResponse {
  /** Whether retrieval succeeded */
  success: boolean;
  /** Result data if found */
  result?: {
    /** Unique result ID */
    id: string;
    /** Archetype slug */
    archetypeSlug: string;
    /** All computed scores */
    scores: DBScores;
    /** ISO timestamp of submission */
    createdAt: string;
  };
  /** Error message if retrieval failed */
  error?: string;
  /** Structured error code */
  errorCode?: "NOT_FOUND";
}

// ============================================================================
// EMAIL CAPTURE (Optional Flow)
// ============================================================================

/** Request to update email for existing result */
export interface UpdateEmailRequest {
  /** Result ID to update */
  resultId: string;
  /** Session ID for ownership verification */
  sessionId: string;
  /** Email address to associate */
  email: string;
}

/** Response from email update */
export interface UpdateEmailResponse {
  /** Whether update succeeded */
  success: boolean;
  /** Error message if update failed */
  error?: string;
}
