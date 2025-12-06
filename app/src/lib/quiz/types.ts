/**
 * Quiz Data Types
 *
 * TypeScript interfaces for the dating personality quiz.
 * Designed for frontend-only storage (localStorage) with future backend compatibility.
 */

// ============================================================================
// SCORING DIMENSIONS
// ============================================================================

/** Attachment style dimensions (Section A) */
export type AttachmentDimension = 'secure' | 'anxious' | 'avoidant' | 'disorganized';

/** Communication style types (Section B) */
export type CommunicationStyle = 'passive' | 'aggressive' | 'passive_aggressive' | 'assertive';

/** Love language types (Section F) */
export type LoveLanguage = 'words' | 'time' | 'service' | 'gifts' | 'touch';

/** Love language direction - giving vs receiving */
export type LoveLanguageDirection = 'give' | 'receive';

/** Intimacy sub-dimensions (Section E) */
export type IntimacyDimension = 'comfort' | 'boundary';

// ============================================================================
// QUESTION TYPES
// ============================================================================

/** Question input type */
export type QuestionType = 'likert' | 'scenario';

/**
 * Scoring target - discriminated union by section
 * Enables type-safe scoring logic per section
 */
export type ScoringTarget =
  | { section: 'attachment'; dimension: AttachmentDimension }
  | { section: 'communication'; style: CommunicationStyle }
  | { section: 'confidence' }
  | { section: 'emotional' }
  | { section: 'intimacy'; dimension: IntimacyDimension }
  | { section: 'love_language'; language: LoveLanguage; direction: LoveLanguageDirection };

// ============================================================================
// QUESTION INTERFACES
// ============================================================================

/** Base question properties shared by all question types */
export interface BaseQuestion {
  /** Unique question ID (e.g., 'S1', 'AX1', 'COM_PASSIVE_1') */
  id: string;
  /** Question text displayed to user */
  text: string;
  /** Question input type */
  type: QuestionType;
  /** Scoring target for this question */
  scoring: ScoringTarget;
  /** If true, score is reversed (5→1, 4→2, etc.) */
  reverse?: boolean;
}

/** Likert scale question (1-5 rating) */
export interface LikertQuestion extends BaseQuestion {
  type: 'likert';
}

/** Option for scenario/multiple-choice questions */
export interface ScenarioOption {
  /** Option key (A, B, C, D) */
  key: string;
  /** Option text */
  text: string;
  /** Scoring target when this option is selected */
  scoring: ScoringTarget;
}

/** Scenario question with multiple choice options */
export interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario';
  /** Available options for this question */
  options: ScenarioOption[];
}

/** Union type for all question types */
export type QuizQuestion = LikertQuestion | ScenarioQuestion;

// ============================================================================
// SECTION GROUPING
// ============================================================================

/** Quiz section containing grouped questions */
export interface QuizSection {
  /** Section ID (e.g., 'attachment', 'communication') */
  id: string;
  /** Section title displayed to user */
  title: string;
  /** Section description */
  description: string;
  /** Questions in this section */
  questions: QuizQuestion[];
}

// ============================================================================
// USER RESPONSES & SESSION
// ============================================================================

/** Single question response */
export interface QuizResponse {
  /** Question ID */
  questionId: string;
  /** Response value (1-5 for Likert) */
  value: number;
  /** Selected option key for scenario questions */
  selectedKey?: string;
  /** Timestamp when answered */
  timestamp: number;
}

/** Quiz session state */
export interface QuizSession {
  /** Unique session ID */
  id: string;
  /** Session start timestamp */
  startedAt: number;
  /** Session completion timestamp */
  completedAt?: number;
  /** All responses */
  responses: QuizResponse[];
  /** Current question index (0-based) */
  currentIndex: number;
}

// ============================================================================
// RESULTS TYPES
// ============================================================================

/** Attachment style result */
export interface AttachmentResult {
  /** Scores for each dimension (0-100) */
  scores: Record<AttachmentDimension, number>;
  /** Primary attachment style - single, array of tied styles, or 'mixed' if all 4 are equal */
  primary: AttachmentDimension | AttachmentDimension[] | 'mixed';
}

/** Communication style result */
export interface CommunicationResult {
  /** Scores for each style (0-100) */
  scores: Record<CommunicationStyle, number>;
  /** Primary communication style - single, array of tied styles, or 'mixed' if all 4 are equal */
  primary: CommunicationStyle | CommunicationStyle[] | 'mixed';
}

/** Intimacy style result */
export interface IntimacyResult {
  /** Intimacy comfort score (0-100) */
  comfort: number;
  /** Boundary assertiveness score (0-100) */
  boundaries: number;
}

/** Love language result */
export interface LoveLanguageResult {
  /** Ranked list of love languages (highest first) */
  ranked: LoveLanguage[];
  /** Scores for each language */
  scores: Record<LoveLanguage, number>;
  /** Give vs receive breakdown */
  giveReceive: Record<LoveLanguage, { give: number; receive: number }>;
}

/** Complete quiz results */
export interface QuizResults {
  /** Attachment style results */
  attachment: AttachmentResult;
  /** Communication style results */
  communication: CommunicationResult;
  /** Dating confidence score (0-100) */
  confidence: number;
  /** Emotional availability score (0-100) */
  emotional: number;
  /** Intimacy style results */
  intimacy: IntimacyResult;
  /** Love language results */
  loveLanguages: LoveLanguageResult;
}

/** Profile archetype based on combined results */
export interface Archetype {
  /** Archetype name */
  name: string;
  /** Emoji icon */
  emoji: string;
  /** Summary description */
  summary: string;
  /** Image path for archetype character */
  image: string;
}

// ============================================================================
// STORAGE TYPES (localStorage)
// ============================================================================

/** Stored session format with version for migrations */
export interface StoredSession {
  version: 1;
  session: QuizSession;
}

/** Stored results format with version for migrations */
export interface StoredResults {
  version: 1;
  computedAt: number;
  results: QuizResults;
  archetype: Archetype;
}
