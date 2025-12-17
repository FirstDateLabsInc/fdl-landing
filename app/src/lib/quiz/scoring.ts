/**
 * Quiz Scoring Module
 *
 * Functions to calculate scores from quiz responses.
 */

import type {
  QuizResponse,
  QuizResults,
  AttachmentResult,
  AttachmentDimension,
  CommunicationResult,
  CommunicationStyle,
  IntimacyResult,
  LoveLanguageResult,
  LoveLanguage,
  AnswerState,
} from './types';
import { getQuestionById, allQuestions } from './questions';

// ============================================================================
// REVERSE SCORING VALIDATION
// ============================================================================

/**
 * Questions that must have reverse: true in their definitions.
 * These are negatively-phrased questions where higher raw scores
 * indicate lower trait presence.
 */
const EXPECTED_REVERSED_QUESTIONS = ['C2', 'C4', 'EA2', 'EA4', 'BA3'] as const;

// Validate reverse scoring configuration at module initialization
(function validateReverseScoringConfig() {
  for (const questionId of EXPECTED_REVERSED_QUESTIONS) {
    const question = getQuestionById(questionId);
    if (!question) {
      console.warn(`[Quiz Scoring] Reverse scoring validation: Question ${questionId} not found`);
      continue;
    }
    if (!question.reverse) {
      console.warn(
        `[Quiz Scoring] Reverse scoring validation: Question ${questionId} should have reverse: true`
      );
    }
  }
})();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get response value for a question ID, applying reverse scoring if needed
 */
function getResponseValue(
  responses: QuizResponse[],
  questionId: string
): number | null {
  const response = responses.find((r) => r.questionId === questionId);
  if (!response) return null;

  const question = getQuestionById(questionId);
  if (!question) return response.value;

  // Apply reverse scoring (6 - value) for reversed questions
  return question.reverse ? 6 - response.value : response.value;
}

/**
 * Convert raw score (1-5 scale) to 0-100 percentage
 */
function normalizeScore(rawScore: number): number {
  // Convert 1-5 to 0-100: (score - 1) / 4 * 100
  return Math.round(((rawScore - 1) / 4) * 100);
}

/**
 * Calculate average of an array of numbers
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// ============================================================================
// ATTACHMENT SCORING (Section A)
// ============================================================================

const ATTACHMENT_QUESTIONS: Record<AttachmentDimension, string[]> = {
  secure: ['S1', 'S2', 'S3'],
  anxious: ['AX1', 'AX2', 'AX3'],
  avoidant: ['AV1', 'AV2', 'AV3'],
  disorganized: ['D1', 'D2', 'D3'],
};

/**
 * Score attachment style from responses
 * Returns scores (0-100) for each dimension and primary style
 */
export function scoreAttachment(responses: QuizResponse[]): AttachmentResult {
  const dimensions: AttachmentDimension[] = ['secure', 'anxious', 'avoidant', 'disorganized'];
  const scores: Record<AttachmentDimension, number> = {
    secure: 0,
    anxious: 0,
    avoidant: 0,
    disorganized: 0,
  };

  for (const dimension of dimensions) {
    const questionIds = ATTACHMENT_QUESTIONS[dimension];
    const values = questionIds
      .map((id) => getResponseValue(responses, id))
      .filter((v): v is number => v !== null);

    if (values.length > 0) {
      scores[dimension] = normalizeScore(average(values));
    }
  }

  // Determine primary attachment style(s) - handle ties
  const maxScore = Math.max(...Object.values(scores));
  const topStyles = dimensions.filter((dim) => scores[dim] === maxScore);

  let primary: AttachmentDimension | AttachmentDimension[] | 'mixed';
  if (topStyles.length === 1) {
    primary = topStyles[0];
  } else if (topStyles.length === 4) {
    primary = 'mixed';
  } else {
    primary = topStyles; // Array of 2-3 tied styles
  }

  return { scores, primary };
}

// ============================================================================
// COMMUNICATION SCORING (Section B)
// ============================================================================

const COMMUNICATION_QUESTIONS: Record<CommunicationStyle, string[]> = {
  passive: ['COM_PASSIVE_1', 'COM_PASSIVE_2'],
  aggressive: ['COM_AGGRESSIVE_1', 'COM_AGGRESSIVE_2'],
  passive_aggressive: ['COM_PAGG_1', 'COM_PAGG_2'],
  assertive: ['COM_ASSERTIVE_1', 'COM_ASSERTIVE_2'],
};

/**
 * Score communication style from responses
 * Scenario response maps directly to style (weighted 2x)
 */
export function scoreCommunication(responses: QuizResponse[]): CommunicationResult {
  const styles: CommunicationStyle[] = ['passive', 'aggressive', 'passive_aggressive', 'assertive'];
  const scores: Record<CommunicationStyle, number> = {
    passive: 0,
    aggressive: 0,
    passive_aggressive: 0,
    assertive: 0,
  };

  // Score Likert questions for each style
  for (const style of styles) {
    const questionIds = COMMUNICATION_QUESTIONS[style];
    const values = questionIds
      .map((id) => getResponseValue(responses, id))
      .filter((v): v is number => v !== null);

    if (values.length > 0) {
      scores[style] = normalizeScore(average(values));
    }
  }

  /**
   * Handle scenario question (COM_SCENARIO_1)
   *
   * The scenario question provides a behavioral indicator of communication style
   * by presenting a real-world situation (date cancellation) with four response options.
   *
   * WEIGHTING RATIONALE:
   * - Likert questions: 2 questions per style, each normalized 0-100, averaged
   * - Scenario: Adds 25-point bonus to selected style
   *
   * This effectively gives the scenario ~2x weight because:
   * - Base Likert avg of 3 (neutral) = 50 points
   * - Scenario bonus = 25 points = 50% of base score
   * - Combined effect: scenario selection can swing primary style determination
   *
   * The 25-point value was chosen to:
   * - Be significant enough to influence primary style determination
   * - Not completely override Likert responses (capped at 100)
   * - Represent approximately one additional "strong agree" response worth of weight
   *
   * CAPPING:
   * Scores are capped at 100 via Math.min() to maintain consistent 0-100 scale
   * and prevent scenario bonus from creating artificially inflated scores.
   */
  const scenarioResponse = responses.find((r) => r.questionId === 'COM_SCENARIO_1');
  if (scenarioResponse?.selectedKey) {
    const keyToStyle: Record<string, CommunicationStyle> = {
      A: 'passive',
      B: 'aggressive',
      C: 'passive_aggressive',
      D: 'assertive',
    };
    const selectedStyle = keyToStyle[scenarioResponse.selectedKey];
    if (selectedStyle) {
      const scenarioBonus = 25;
      scores[selectedStyle] = Math.min(100, scores[selectedStyle] + scenarioBonus);
    }
  }

  // Determine primary communication style(s) - handle ties
  const maxScore = Math.max(...Object.values(scores));
  const topStyles = styles.filter((style) => scores[style] === maxScore);

  let primary: CommunicationStyle | CommunicationStyle[] | 'mixed';
  if (topStyles.length === 1) {
    primary = topStyles[0];
  } else if (topStyles.length === 4) {
    primary = 'mixed';
  } else {
    primary = topStyles; // Array of 2-3 tied styles
  }

  return { scores, primary };
}

// ============================================================================
// CONFIDENCE SCORING (Section C)
// ============================================================================

const CONFIDENCE_QUESTIONS = ['C1', 'C2', 'C3', 'C4', 'C5'];

/**
 * Score dating confidence from responses
 * Returns 0-100 score (C2, C4 are reverse-scored in question data)
 */
export function scoreConfidence(responses: QuizResponse[]): number {
  const values = CONFIDENCE_QUESTIONS
    .map((id) => getResponseValue(responses, id))
    .filter((v): v is number => v !== null);

  if (values.length === 0) return 0;
  return normalizeScore(average(values));
}

// ============================================================================
// EMOTIONAL AVAILABILITY SCORING (Section D)
// ============================================================================

const EMOTIONAL_QUESTIONS = ['EA1', 'EA2', 'EA3', 'EA4', 'EA5'];

/**
 * Score emotional availability from responses
 * Returns 0-100 score (EA2, EA4 are reverse-scored in question data)
 */
export function scoreEmotionalAvailability(responses: QuizResponse[]): number {
  const values = EMOTIONAL_QUESTIONS
    .map((id) => getResponseValue(responses, id))
    .filter((v): v is number => v !== null);

  if (values.length === 0) return 0;
  return normalizeScore(average(values));
}

// ============================================================================
// INTIMACY SCORING (Section E)
// ============================================================================

const INTIMACY_COMFORT_QUESTIONS = ['IC1', 'IC2', 'IC3'];
const INTIMACY_BOUNDARY_QUESTIONS = ['BA1', 'BA2', 'BA3'];

/**
 * Score intimacy from responses
 * Returns comfort and boundary scores (0-100 each)
 * BA3 is reverse-scored in question data
 */
export function scoreIntimacy(responses: QuizResponse[]): IntimacyResult {
  const comfortValues = INTIMACY_COMFORT_QUESTIONS
    .map((id) => getResponseValue(responses, id))
    .filter((v): v is number => v !== null);

  const boundaryValues = INTIMACY_BOUNDARY_QUESTIONS
    .map((id) => getResponseValue(responses, id))
    .filter((v): v is number => v !== null);

  return {
    comfort: comfortValues.length > 0 ? normalizeScore(average(comfortValues)) : 0,
    boundaries: boundaryValues.length > 0 ? normalizeScore(average(boundaryValues)) : 0,
  };
}

// ============================================================================
// LOVE LANGUAGES SCORING (Section F)
// ============================================================================

const LOVE_LANGUAGE_QUESTIONS: Record<LoveLanguage, { give: string; receive: string }> = {
  words: { give: 'LL1', receive: 'LL2' },
  time: { give: 'LL3', receive: 'LL4' },
  service: { give: 'LL5', receive: 'LL6' },
  gifts: { give: 'LL7', receive: 'LL8' },
  touch: { give: 'LL9', receive: 'LL10' },
};

/**
 * Score love languages from responses
 * Returns ranked list and scores for each language
 */
export function scoreLoveLanguages(responses: QuizResponse[]): LoveLanguageResult {
  const languages: LoveLanguage[] = ['words', 'time', 'service', 'gifts', 'touch'];

  const scores: Record<LoveLanguage, number> = {
    words: 0,
    time: 0,
    service: 0,
    gifts: 0,
    touch: 0,
  };

  const giveReceive: Record<LoveLanguage, { give: number; receive: number }> = {
    words: { give: 0, receive: 0 },
    time: { give: 0, receive: 0 },
    service: { give: 0, receive: 0 },
    gifts: { give: 0, receive: 0 },
    touch: { give: 0, receive: 0 },
  };

  for (const lang of languages) {
    const { give, receive } = LOVE_LANGUAGE_QUESTIONS[lang];

    const giveValue = getResponseValue(responses, give);
    const receiveValue = getResponseValue(responses, receive);

    giveReceive[lang] = {
      give: giveValue !== null ? normalizeScore(giveValue) : 0,
      receive: receiveValue !== null ? normalizeScore(receiveValue) : 0,
    };

    // Combined score is average of give and receive
    const values = [giveValue, receiveValue].filter((v): v is number => v !== null);
    scores[lang] = values.length > 0 ? normalizeScore(average(values)) : 0;
  }

  // Rank languages by combined score (highest first)
  const ranked = [...languages].sort((a, b) => scores[b] - scores[a]);

  return { ranked, scores, giveReceive };
}

// ============================================================================
// MASTER SCORING FUNCTION
// ============================================================================

/**
 * Calculate all quiz results from responses
 */
export function calculateAllResults(responses: QuizResponse[]): QuizResults {
  return {
    attachment: scoreAttachment(responses),
    communication: scoreCommunication(responses),
    confidence: scoreConfidence(responses),
    emotional: scoreEmotionalAvailability(responses),
    intimacy: scoreIntimacy(responses),
    loveLanguages: scoreLoveLanguages(responses),
  };
}

/**
 * Get response map from quiz responses array
 */
export function getResponseMap(responses: QuizResponse[]): Record<string, number | string> {
  const map: Record<string, number | string> = {};
  for (const response of responses) {
    if (response.selectedKey) {
      map[response.questionId] = response.selectedKey;
    } else {
      map[response.questionId] = response.value;
    }
  }
  return map;
}

/**
 * Convert response map to QuizResponse array
 */
// Accept both legacy response maps and the new AnswerState for compatibility
export function mapToResponses(
  responseMap: Record<string, number | string> | AnswerState
): QuizResponse[] {
  const now = Date.now();
  return Object.entries(responseMap).map(([questionId, value]) => {
    // New shape: QuizAnswer object
    if (typeof value === 'object' && value !== null && 'value' in value) {
      const answer = value as { value: number; selectedKey?: string; timestamp?: number };
      return {
        questionId,
        value: answer.value,
        selectedKey: answer.selectedKey,
        timestamp: answer.timestamp ?? now,
      };
    }

    // Legacy map shape: number | string
    const question = getQuestionById(questionId);
    if (question?.type === 'scenario' && typeof value === 'string') {
      return {
        questionId,
        value: 0, // scenario questions don't use numeric value directly
        selectedKey: value,
        timestamp: now,
      };
    }
    return {
      questionId,
      value: typeof value === 'number' ? value : 0,
      timestamp: now,
    };
  });
}

/**
 * Check if quiz is complete (all questions answered)
 */
export function isQuizComplete(responses: QuizResponse[]): boolean {
  const answeredIds = new Set(responses.map((r) => r.questionId));
  return allQuestions.every((q) => answeredIds.has(q.id));
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(responses: QuizResponse[]): number {
  return Math.round((responses.length / allQuestions.length) * 100);
}
