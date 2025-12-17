import type { DBAnswerMap, QuizResponse, QuizResults } from "../types";
import type { ArchetypePublic } from "../archetypes";
import { deserializeAnswers, toQuizResponses } from "../utils/answer-transform";
import { calculateAllResults } from "../scoring";
import { computeArchetypeByProbability } from "../data/archetypes/joint-probability";

export interface ScoredQuizResult {
  responses: QuizResponse[];
  results: QuizResults;
  archetype: ArchetypePublic;
  archetypeSlug: string;
  confidence: number;
  isBalanced: boolean;
}

/**
 * Server-side scoring entry point.
 * - Converts DBAnswerMap to responses
 * - Computes QuizResults
 * - Selects archetype via joint probability
 */
export function scoreQuizFromAnswers(answers: DBAnswerMap): ScoredQuizResult {
  const answerState = deserializeAnswers(answers);
  const responses = toQuizResponses(answerState);

  const results = calculateAllResults(responses);
  const { archetype, confidence, isBalanced } = computeArchetypeByProbability(results);

  return {
    responses,
    results,
    archetype,
    archetypeSlug: archetype.id,
    confidence,
    isBalanced,
  };
}
