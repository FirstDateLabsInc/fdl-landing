/**
 * API Types Barrel Export
 *
 * Centralized API contracts for all Worker endpoints.
 * Import from here or from domain-specific barrels (e.g., @/lib/api/quiz).
 */

// Shared types
export type { TrackingParams, CommonErrorCode } from "./shared";

// Quiz API
export type {
  QuizErrorCode,
  CreateSessionRequest,
  CreateSessionResponse,
  SubmitQuizRequest,
  SubmitQuizResponse,
  GetResultRequest,
  GetResultResponse,
  UpdateEmailRequest,
  UpdateEmailResponse,
} from "./quiz";

// Waitlist API
export type {
  WaitlistErrorCode,
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from "./waitlist";
