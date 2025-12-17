import type {
  AnswerState,
  DBAnswerEntry,
  DBAnswerMap,
  QuizResponse,
  QuizResults,
} from "../types";
import type { DBScores } from "../types-db";

/**
 * Compress frontend answer state into DB-friendly map for JSONB storage
 * - Likert questions: include v (1-5), omit k
 * - Scenario questions: include k (A/B/C/D), omit v
 */
export function serializeAnswers(answers: AnswerState): DBAnswerMap {
  const dbMap: DBAnswerMap = {};
  for (const [questionId, data] of Object.entries(answers)) {
    const entry: DBAnswerEntry = {
      t: data.timestamp,
    };
    // Only include v for likert questions (value 1-5)
    // Scenario questions have value=0 which is meaningless
    if (data.value > 0) {
      entry.v = data.value;
    }
    // Only include k for scenario questions
    if (data.selectedKey) {
      entry.k = data.selectedKey;
    }
    dbMap[questionId] = entry;
  }
  return dbMap;
}

/**
 * Expand DB map back to frontend answer state when restoring progress
 * Handles both old format (v always present) and new format (v optional for scenarios)
 */
export function deserializeAnswers(dbMap: DBAnswerMap | null | undefined): AnswerState {
  const answers: AnswerState = {};
  if (!dbMap) return answers;

  for (const [questionId, entry] of Object.entries(dbMap)) {
    answers[questionId] = {
      // Default to 0 if v is missing (scenario questions)
      value: entry.v ?? 0,
      timestamp: entry.t,
      selectedKey: entry.k,
    };
  }
  return answers;
}

/**
 * Adapter: convert AnswerState to QuizResponse[] for existing client-side scoring
 */
export function toQuizResponses(answers: AnswerState): QuizResponse[] {
  return Object.entries(answers).map(([questionId, data]) => ({
    questionId,
    value: data.value,
    selectedKey: data.selectedKey,
    timestamp: data.timestamp,
  }));
}

/**
 * Strip UI-only fields and keep metrics for DB/Worker storage
 */
export function sanitizeScoresForDb(results: QuizResults): DBScores {
  const { attachment, communication, confidence, emotional, intimacy, loveLanguages } = results;
  return {
    attachment,
    communication,
    confidence,
    emotional,
    intimacy,
    loveLanguages,
  };
}
