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
 */
export function serializeAnswers(answers: AnswerState): DBAnswerMap {
  const dbMap: DBAnswerMap = {};
  for (const [questionId, data] of Object.entries(answers)) {
    const entry: DBAnswerEntry = {
      v: data.value,
      t: data.timestamp,
    };
    if (data.selectedKey) {
      entry.k = data.selectedKey;
    }
    dbMap[questionId] = entry;
  }
  return dbMap;
}

/**
 * Expand DB map back to frontend answer state when restoring progress
 */
export function deserializeAnswers(dbMap: DBAnswerMap | null | undefined): AnswerState {
  const answers: AnswerState = {};
  if (!dbMap) return answers;

  for (const [questionId, entry] of Object.entries(dbMap)) {
    answers[questionId] = {
      value: entry.v,
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
